# Crop Yield Analysis

## Topic Selection

Our group selected the topic of crop yield, which is based on different factors such as temperature, nutrients, land use, and pesticides. Agriculture is a critical role in the global economy and understanding it can help solve global challenges, such as food security and reducing impact of climate change. We were interested in the crop yield data and wanted to determine what conditions create the best crop yield and which conditions have a higher effect on which countries yield the most crops for the year. The data source is from Kaggle, which uses the publicly available datasets from Food and Agriculture Organization (FAO) and World Data Bank.

The data can be found at https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset

## Questions we Hope to Answer
- Which country has the best conditions to yield the most crop consistently over time?
- Which factors (temperature, nutrients, etc.) are the most important for impacting the highest crop yield?
- How can countries maximize their crop yield based on the important factors considered?

## Communication Protocols
Our group will utilize Slack, text messages, and Zoom meetings to keep communication open between all five group members. This way if a team member has a question or needs help outside of designated class meeting hours, they can post a message in slack, meet up with a team member(s) in Zoom or send a text for a more immediate response. One team member is in a different time zone, two hours behind the other team members; the team recognizes this potential issue and will plan meetings ahead of time utilizing evenings and weekends. Our group will divide tasks between the five group members and remain open to different forms of communication if necessary or if something is not working.

## Database
We connected our cleaned data to Postgres with a connection string using SQLAlchemy and the to_sql() method in Pandas. We created an engine and exported each of the cleaned tables(9) to the database, Crop_Yields_DB, which was created in  the local Postgres server. Images of the tables in Postgres can be viewed in the db_table_pngs folder. 
~~~ 
# connection string for local server
db_string = f"postgresql://postgres:{db_password}@127.0.0.1:5432/Crop_Yields_DB"
# create engine
engine = create_engine(db_string)
~~~
The tables were then exported:
~~~
#import data to SQL tables using to_sql()
yield_df_clean.to_sql(name='yield', con=engine, if_exists='replace')
lat_long_df_clean.to_sql(name='lat_long', con=engine, if_exists='replace')

pesticides_df_clean.to_sql(name='pesticides', con=engine, if_exists='replace')

nitrogen_df_clean.to_sql(name='nitrogen', con=engine, if_exists='replace')
phosphate_df_clean.to_sql(name='phosphate', con=engine, if_exists='replace')
potash_df_clean.to_sql(name='potash', con=engine, if_exists='replace')

temp_df_clean.to_sql(name='temperature', con=engine, if_exists='replace')

agri_df_clean.to_sql(name='agri', con=engine, if_exists='replace')
arable_df_clean.to_sql(name='arable', con=engine, if_exists='replace')
~~~
In Postrges, we checked that the tables imported properly, then the 9 tables were joined using inner joins and the columns were renamed to avoid confusion with the values as seen in the join_query.sql file. Then we checked that the number of countries matched the number of countries in our clean_data.ipynb, which was 106. There were three countries from the lat_long table that needed str.replace to match the other tables so the data would not be lost. After this there were 106 countries. The fully joined table was named total_yields and exported as a csv. To import the total_yields table back into a notebook to use for the machine learning preprocessing and subsequent model run, we used the same connection string and create engine code as above followed by pandas read_sql_table() method:
~~~
#read in joined sql table
total_yields_df = pd.read_sql_table('total_yields', con=engine)
~~~
Now the database is intergrated with the clean data file, stored as tables in a static database, and interfaces with the machine learning model as a new Pandas dataframe. 


## Machine Learning Module Connection to Provisional Database

We used Jupyter Notebook and python code to create a crop_yield dataframe for the country, Albania. We created 2 linear regression models. The first model did not have a great linear relationship, so we modified the dataframe to be only for the crop, Maize for the country of Albania. We ran the linear regression model again for those conditions and determined a better relationship. Refer to the graph screenshots below for both linear regression models.

## Linear Regression - Albania
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Linear_Regression_Albania.png)
- This shows that the linear regression is relatively flat and not very good statistically.

## Linear Regression - Albania and Maize
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Linear_Regression_Albania_Corn.png)
- This shows that the linear regression is diagonal and very good statistically.

## Correlation of Albania and Maize dataframe
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Corr_Albania_Corn.png)
- This shows there are a high correlations between the fields in the Albania and Maize dataframe.

## Dashboard
We will be using Leaflet, an open-source JavaScript library, that facilitates the development of interactive maps. Our map will have pins for each county, with the option to filter for different crops. When you click on the country you are able to see a prediction for future crop yields.

