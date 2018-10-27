# WeShouldntBeHere
A platform to spread awareness about natural disasters and help crowd source relief funds. We are doing this by searching for the high traction areas in social media websites like Reddit and by publicizing the disasters along with the official relief donation link. The website is supposed to be a one-stop site for potential relief fund donators. Also via the website, we expect the victims to start a relief fund crowd sourcing campaign. To mitigate the possibilities of false trigger, the admin will gratify the campaign requests and will trigger the bots accordingly. As an another method of notifying the admin, we have created a news aggregation bot which tracks recent news feed from the subreddit `r/news` by streaming api methods. Then this bot stores the permalink of the relevant posts in a text file for the admin to read. This file is overwritten once a day.

In this project, we have used Node.JS, ReactJS and MongoDB for the website development and Python for the bots development.

## Steps to get it running:

1. Clone the project
2. `cd` to the project directory
3. Run `npm install`
4. Install mongo and follow official instructions to get an instance of mongo running,and create a Database `Hackabit`
5. Install praw, bs4
6. Execute the python scripts(in the bot folder)
7. Run `npm start`

For triggering the campaign bot, we need to create an instance of `RedditBot` class, which requires 4 parameters --
* `praw_site`: A site for `praw` initialization file. Create a `praw.ini` file in the bots directory and pass the bots credentials in the following way:
    `[praw_site_name]`
    `client_id=<client_id>`
    `client_secret=<client_secret>`
    `password=<password>`
    `username=<username>`
* `intensity_of_campaign`: Possible values `low` | `medium` | `high`. `low` corresponds to the bot interacting with 20 different subreddits. Similary, `medium` corresponds to 40 and `high` corresponds to 60 different subreddits.
* `donate_link`: Official donation link for the disaster.
* `message`: Message to publicize.
After creating the instance, simply call `start_campaign()` with parameter `num_of_posts_per_sub` (integer) to start the campaign. `num_of_posts_per_sub` controls the number of different posts you want the bot to interact with in each subreddit.

For triggering the news aggregation bot, create an instance of the `News_Aggregator` class, which requires a single parameter -- `praw_site`.
To simply start the aggregation task, call the function `start_aggregating()` on the object. It will write down the permalinks of the relevant news posts. **NOTE**: The permalinks will first get updated after 24 hours of running the bot.