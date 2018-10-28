import praw, re, datetime, threading

class News_Aggregator(object):
    def __init__(self, praw_site):
        # initializing Reddit instance
        self.reddit = praw.Reddit(praw_site, user_agent='bot u-agent2')

        self.permalinks = list()        # contains permalinks of relevant posts

        self.pattern = re.compile(r'disaster?s|calamity|calamities|earthquake?s|flood?s|terrorist?s|landslide|cyclone|epidemic|tsunami')


    def stream_posts(self):
        subreddit_news = self.reddit.subreddit('news')
        for submission in subreddit_news.stream.submissions():
            if self.is_relevant(submission.title):
                self.permalinks.append(submission.permalink)


    def is_relevant(self, post_body):
        matches = self.pattern.findall(post_body)
        if len(post_body) > 0:
            return True
        return False


    def notify_admin(self):
        threading.Timer(86400.0, self.notify_admin).start()
        with open("db_%s.txt" % datetime.datetime.today().strftime("%d-%m-%Y"), 'w') as f:
            for permalink in self.permalinks:
                f.write("%s\n" % permalink)

            # flushing permalink
            self.permalinks = list()


    def start_aggregating(self):
        # maintaining the order of sequence is important for threading
        self.notify_admin()
        self.stream_posts()


if __name__ == "__main__":
    news = News_Aggregator('bot2')
    news.start_aggregating()
