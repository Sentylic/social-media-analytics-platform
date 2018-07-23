

import argparse
import datetime
import locale
import logging
import re
import sys
import time
import io

import pandas as pd
from selenium import webdriver
from selenium.common.exceptions import InvalidElementStateException

import warnings

warnings.filterwarnings('ignore')

class Review():
    def __init__(self, id, date, title, text):
        self.id = id
        self.date = date
        self.title = title
        self.text = text


class TripadvisorScraper():
    def __init__(self, engine='phantomjs'):
        self.language = 'en'
        self.locale_backup = locale.getlocale()[0]
        self.lookup = {}
        self.title = 'output'
        self.i = 0

        if engine == 'chrome':
            self.driver = webdriver.Chrome()
        elif engine == 'firefox':
            self.driver = webdriver.Firefox()
        elif engine == 'phantomjs':
            self.driver = webdriver.PhantomJS()
        else:
            self.driver = webdriver.PhantomJS()

        print 'webdriver started'

    def _parse_page(self):
        reviews = []
        self.driver.refresh()
        try:
            self.driver.find_element_by_xpath('//span[contains(., "More") and @class="taLnk ulBlueLinks"]').click()
        except:
            pass

        time.sleep(2)  # TODO

        review_elements = self.driver.find_elements_by_class_name('reviewSelector')
        for e in review_elements:
            try:
                id = e.get_attribute('id')
                date = e.find_element_by_class_name(
                    'ratingDate').get_attribute('title')
                date = datetime.datetime.strptime(
                    date, '%B %d, %Y')
                title = e.find_element_by_class_name('quote').find_element_by_tag_name(
                    'a').find_element_by_class_name('noQuotes').text
                text = e.find_element_by_class_name('partial_entry').text.replace('\n', '')
                if id not in self.lookup and text != '':
                    self.lookup[id] = True
                    reviews.append(Review(id, date, title, text))
            except:
                pass
        print self.driver.current_url
        print 'scraped', len(reviews)
        return reviews

    def fetch_reviews(self, url, max_reviews=None, as_dataframe=True):
        self.lookup = {}
        reviews = []
        if not max_reviews:
            max_reviews = sys.maxsize
        self.driver.get(url)
        time.sleep(2)  # TODO

        self.title = self.driver.find_element_by_id('HEADING').text
        while len(reviews) < max_reviews:
            reviews += self._parse_page()
            logging.info(
                'Fetched a total of {} reviews by now.'.format(len(reviews)))
            next_button_container = self.driver.find_element_by_class_name('next')
            if 'disabled' in next_button_container.get_attribute('class'):
                break
            self.driver.execute_script(
                "event=document.createEvent('MouseEvent');event.initMouseEvent('click',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);document.getElementsByClassName('next')[0].dispatchEvent(event);")
            time.sleep(2)

        locale.setlocale(locale.LC_TIME, self.locale_backup)
        reviews = reviews[:max_reviews]
        if as_dataframe:
            return pd.DataFrame.from_records([r.__dict__ for r in reviews]).set_index('id', drop=True)
        return reviews

    def close(self):
        self.driver.quit()


def get_language_by_url(url):
    if 'tripadvisor.de' in url:
        return 'de'
    elif 'tripadvisor.com' in url:
        return 'en'
    return None


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Scrape restaurant reviews from Tripadvisor (.com or .de).')
    parser.add_argument('url', help='URL to a Tripadvisor restaurant page')
    parser.add_argument('-o', '--out', dest='outdir',
                        help='Directory for output JSON file', default='tripadvisor-scraper')
    parser.add_argument(
        '-n', dest='max', help='Maximum number of reviews to fetch', default=sys.maxsize, type=int)
    parser.add_argument('-e', '--engine', dest='engine', help='Driver to use',
                        choices=['phantomjs', 'chrome', 'firefox'], default='phantomjs')
    args = parser.parse_args()

    print 'python script started'
    scraper = TripadvisorScraper(engine=args.engine)
    df = scraper.fetch_reviews(args.url, args.max)
    output_file = '{}/{}.json'.replace(' ', '\\ ').format(args.outdir, scraper.title)
    # do not change 'output_file:' and do not start any other print statement with 'output_file:'
    print('output_file:{}'.format(output_file))
    df.to_json(output_file, orient='records', date_format='iso')
    scraper.close()
