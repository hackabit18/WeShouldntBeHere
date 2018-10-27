import praw
import requests as rq
from bs4 import BeautifulSoup
import zerorpc

class RedditBotRPC(object):
    def start_reddit_campaign(self, intensity_of_campaign, donate_link, message, number_of_posts_per_sub):
        bot = RedditBot('bot1', intensity_of_campaign, donate_link, message)
        bot.start_campaign(number_of_posts_per_sub)
        return bot.permalinks

class RedditBot(object):
    def __init__(self, praw_site, intensity_of_campaign, donate_link, message):
        # initializing reddit instance
        self.reddit = praw.Reddit(praw_site, user_agent='bot u-agent')
        self.to_be_subreddits = list()  # contains subreddits that have been used in the campaign
        self.unique_ids_post = list()   # contains unique_ids of the posts comnented to
        self.permalinks = list()        # contains permalinks to the comments added

        if intensity_of_campaign.lower() == 'low':
            self.number_of_subreddits = 20
        elif intensity_of_campaign.lower() == 'medium':
            self.number_of_subreddits = 40
        else:
            self.number_of_subreddits = 60

        self.donate_link = donate_link

        self.MESSAGE = message


    def scrap_sub_list(self):
        BASE_URL = 'http://redditlist.com/'

        # requesting & parsing
        current_pg = rq.get(BASE_URL)
        soup = BeautifulSoup(current_pg.text, 'html.parser')

        # extracting info
        categories = soup.find_all('div', class_='listing')
        recent_activity_subreddits = categories[0]
        highest_subscribers_subreddits = categories[1]
        recent_high_growth_subreddits = categories[2]

        # appending recent activity subreddits
        sub_list = recent_activity_subreddits.find_all('div', class_='listing-item')
        for i in range(int(0.5 * self.number_of_subreddits)):
            sub_name = sub_list[i].find('a').get_text()
            self.to_be_subreddits.append(sub_name)

        # appending recent high growth subreddits
        sub_list = recent_high_growth_subreddits.find_all('div', class_='listing-item')
        counter, i = 0, 0
        while counter < int(0.25 * self.number_of_subreddits):
            sub_name = sub_list[i].find('a').get_text()
            if sub_name not in self.to_be_subreddits:   # removing possible duplicate subs
                counter += 1
                self.to_be_subreddits.append(sub_name)
            i += 1

        # append highest subscribers subreddits
        sub_list = highest_subscribers_subreddits.find_all('div', class_='listing-item')
        counter, i = 0, 0
        while counter < int(0.25 * self.number_of_subreddits):
            sub_name = sub_list[i].find('a').get('href')
            if sub_name not in self.to_be_subreddits:   # removing possible duplicate subs
                counter += 1
                self.to_be_subreddits.append(sub_name)
            i += 1


    def crawl(self, number_of_posts, sort_by='rising'):
        for sub in self.to_be_subreddits:
            sub_reddit = self.reddit.subreddit(sub)
            if sort_by.lower() == 'rising':
                posts = sub_reddit.rising(limit=number_of_posts)
            else:
                posts = sub_reddit.hot(limit=number_of_posts)
            for post in posts:
                pm = self.comment_to_post(post, self.MESSAGE)
                self.permalinks.append(pm)


    def comment_to_post(self, submission, comment):
        u_id = submission.id
        if u_id not in self.unique_ids_post:
            cmt = submission.reply(comment)
            return cmt.permalink
        return -1       # refers that the post is already commented


    def start_campaign(self, num_of_posts_per_sub):
        self.scrap_sub_list()
        self.crawl(num_of_posts_per_sub, sort_by='rising')
        self.crawl(num_of_posts_per_sub, sort_by='hot')

s = zerorpc.Server(RedditBotRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()