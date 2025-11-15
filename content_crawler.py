import requests
from bs4 import BeautifulSoup
import time
import os
from urllib.parse import urljoin, urlparse
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class WebContentScraper:
    def __init__(self):
        self.session = requests.Session()
        # 设置重试策略
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        # 设置请求头，模拟浏览器
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        self.all_content = []

    def get_page_content(self, url):
        """获取单个网页的文本内容"""
        try:
            print(f"正在爬取: {url}")
            response = self.session.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()  # 如果状态码不是200，抛出异常
            response.encoding = response.apparent_encoding  # 自动检测编码

            # 使用BeautifulSoup解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')

            # 移除不需要的标签
            for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                element.decompose()

            # 获取正文内容
            # 尝试多种选择器来找到主要内容区域
            content_selectors = [
                'article',
                '.content',
                '.main-content',
                '.post-content',
                '#content',
                'main',
                '.article-content',
                '.entry-content'
            ]

            content = None
            for selector in content_selectors:
                content = soup.select_one(selector)
                if content:
                    break

            # 如果没有找到特定内容区域，使用body
            if not content:
                content = soup.find('body')

            if content:
                # 获取所有文本，并清理空白字符
                text = content.get_text(separator='\n', strip=True)
                # 进一步清理多余的空白行
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                cleaned_text = '\n'.join(lines)
                return cleaned_text
            else:
                return "未找到主要内容"

        except requests.exceptions.RequestException as e:
            print(f"爬取失败 {url}: {e}")
            return f"【爬取失败】: {str(e)}"
        except Exception as e:
            print(f"解析失败 {url}: {e}")
            return f"【解析失败】: {str(e)}"

    def scrape_multiple_pages(self, urls, delay=1):
        """批量爬取多个网页"""
        print(f"开始批量爬取 {len(urls)} 个网页...")

        for i, url in enumerate(urls, 1):
            print(f"进度: {i}/{len(urls)}")

            content = self.get_page_content(url)

            # 添加分隔符和URL信息
            separator = f"\n{'=' * 80}\n"
            url_header = f"URL: {url}\n爬取时间: {time.strftime('%Y-%m-%d %H:%M:%S')}\n{'-' * 40}\n"

            self.all_content.append(separator + url_header + content)

            # 延迟，避免请求过快
            if i < len(urls):  # 最后一个不需要延迟
                time.sleep(delay)

        print("所有网页爬取完成！")

    def save_to_txt(self, filename="combined_content.txt"):
        """保存所有内容到一个TXT文件"""
        if not self.all_content:
            print("没有内容可保存！")
            return

        # 添加文件头
        file_header = f"""网页内容汇总
生成时间: {time.strftime('%Y-%m-%d %H:%M:%S')}
总网页数: {len(self.all_content)}
{'=' * 80}

"""

        full_content = file_header + '\n'.join(self.all_content)

        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(full_content)
            print(f"内容已保存到: {filename}")
            print(f"文件大小: {len(full_content)} 字符")
        except Exception as e:
            print(f"保存文件失败: {e}")

    def get_urls_from_file(self, filename):
        """从文本文件读取URL列表"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            return urls
        except Exception as e:
            print(f"读取URL文件失败: {e}")
            return []


def main():
    # 创建爬虫实例
    scraper = WebContentScraper()

    # # 方式1: 直接在代码中指定URL列表
    # with open('工业设计史每页网址.txt', 'r', encoding='utf-8') as f:
    # urls = f.readlines()

    # 方式2: 从文件读取URL列表（推荐）
    # 创建一个urls.txt文件，每行一个URL
    urls = scraper.get_urls_from_file("工业设计史每页网址.txt")

    if not urls:
        print("请提供要爬取的URL列表！")
        return

    # 批量爬取
    scraper.scrape_multiple_pages(urls, delay=1)  # delay参数控制请求间隔（秒）

    # 保存到文件
    output_filename = "网页内容汇总.txt"
    scraper.save_to_txt(output_filename)

    # 打印统计信息
    total_chars = sum(len(content) for content in scraper.all_content)
    print(f"\n统计信息:")
    print(f"- 成功爬取: {len(scraper.all_content)} 个网页")
    print(f"- 总字符数: {total_chars}")
    print(f"- 输出文件: {output_filename}")


if __name__ == "__main__":
    main()