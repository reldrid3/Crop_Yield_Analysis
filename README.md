# Crop Yield Analysis

## Topic Selection

Our group selected the topic of crop yield, which is based on different factors such as temperature, nutrients, land use, and pesticides. Agriculture is a critical role in the global economy and understanding it can help solve global challenges, such as food security and reducing effects on and impact of climate change. Between the pandemic, the war in Ukraine, climate disasters, and inflation driving higher food prices, food scarcity is a topic at the forefront of the global economic and political landscape. We were interested in the crop yield data and wanted to determine what conditions create the best crop yield and which conditions have a higher effect on which countries yield the most crops for the year.

## Data Selection
We originally selected data from [kaggle](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset), but realized the rainfall data was corrupt(all the same values). So we got data from the [Food and Agriculture Organization (FAO)](https://www.fao.org/faostat/en/#data/domains_table), where we were able to select data from variables we thought would be interesting. These include:
* [Agricultural and Arable Land](https://www.fao.org/faostat/en/#data/RL)
* [Nutrient Application: Nitrogen, Phosophate,Potash](https://www.fao.org/faostat/en/#data/RFN)
* [Pesticides](https://www.fao.org/faostat/en/#data/RP)
* [Temperature](https://www.fao.org/faostat/en/#data/ET)
* [Crop yields](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset)

In order to create a map for our dashboard we also added [latitude and longitude data](https://developers.google.com/public-data/docs/canonical/countries_csv)

## Questions we Hope to Answer
- Which country has the best conditions to yield the most crop consistently over time?
- Which factors (temperature, nutrients, etc.) are the most important for impacting the highest crop yield?
- How can countries maximize their crop yield based on the important factors considered?

### Data Exploration Phase
During our exploratory data analysis we created a function to clean all the datasets that we import from the FAO website. This included dropping null values, dropping duplicates, and discovering which years there was adequate data for. We determined there was sufficient data during the years 2008-2013. We were able to loop through the data and add previous years data as features that could influence that years yields. 

### Data Analysis Phase
During our data analysis phase we continued to pair down the data by using str.replace() to match all country names and correct variations in spelling. At this point there were 106 countries we used for our analysis. The crops value_counts for those countries are as follows:

![Screen Shot 2022-09-11 at 6 14 38 PM](https://user-images.githubusercontent.com/99676466/189555201-28ee5f96-056c-467d-b92e-7256e2e5d6a0.png)

The exploratory and analysis phases both took longer and were more complicated than we had originally planned for, but we feel confident the data we have selected will help us learn some interesting things about what influences crop yields.

## Communication Protocols
Our group will utilize Slack, text messages, and Zoom meetings to keep communication open between all five group members. This way if a team member has a question or needs help outside of designated class meeting hours, they can post a message in slack, meet up with a team member(s) in Zoom or send a text for a more immediate response. One team member is in a different time zone, two hours behind the other team members; the team recognizes this potential issue and will plan meetings ahead of time utilizing evenings and weekends. Our group will divide tasks between the five group members and remain open to different forms of communication if necessary or if something is not working.

## Database

![Crop_Yield_Analysis Entity Relationship Diagram](https://user-images.githubusercontent.com/103209236/189776825-96dffa7f-a1a6-4ea5-ad41-4b9a47bc1d26.png)

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
Now the database is integrated with the clean data file, stored as tables in a static database, and interfaces with the machine learning model as a new Pandas dataframe. 


## Machine Learning Model - Week 1

We used Jupyter Notebook and python code to create a crop_yield dataframe for the country, Albania. We created 2 linear regression models. The first model did not have a great linear relationship, so we modified the dataframe to be only for the crop, Maize for the country of Albania. We ran the linear regression model again for those conditions and determined a better relationship. Refer to the graph screenshots below for both linear regression models.

### Linear Regression - Albania
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Linear_Regression_Albania.png)
- This shows that the linear regression is relatively flat and not very good statistically.

### Linear Regression - Albania and Maize
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Linear_Regression_Albania_Corn.png)
- This shows that the linear regression is diagonal and very good statistically.

### Correlation of Albania and Maize dataframe
![Image](https://github.com/emaynard10/Crop_Yield_Analysis/blob/courtney_s/screenshot_images/Corr_Albania_Corn.png)
- This shows there are a high correlations between the fields in the Albania and Maize dataframe.


## Machine Learning Model - Week 2

We improved our linear regression model by running a multivariate linear regression model. We choose this model because we wanted to factor multiple conditions such as average temperature, nutrient use of fertilizer (phosphate, potash, and nitrogen), land use size, pesticide amount, yield amounts for the past 5 years, and previous year's values for each of the conditions. Linear regression works best for our model because we are predicting a numerical outcome, not a classification. 

Each country will have their own regression model. This model only runs the data for Albania. If we were to run the model for every country at once, the model would be far too noisey to produce any useful information.

![image](https://user-images.githubusercontent.com/103209236/189551477-499797ed-400e-44f2-8af7-ee79232277a4.png)

The target is 'yield'. This is how much crop yield a country produces (hectogram/hectare). It is the target because we are using the other variables to predict the crop yield of each country. The features are variables that affect the yield. This includes...
  - The yield amounts for the prior five years
  - The average temperature including the prior five years
  - The potash amount including the prior three years
  - The nitrogen amount including the prior three years
  - The phosphate amount including the prior three years
  - The pesticide amount including the prior three years
  - The nitrogen amount including the prior three years
  - How much a county's land is dedicated to agriculture
  - How much of a county's land is arable (able to be farmed). 

 ### Data preprocessing 
 ####  Feature Selection
 We did not include the year and long & lat since they are not variables in considering how much yield a country would have.

![image](https://user-images.githubusercontent.com/103209236/189550887-95d391a6-7e9a-47ac-8785-e205a0341ebf.png)

#### Training vs. Testing Data Split
Because our dataset is relatively large, we split 30% of the data into the test data set and 70% of the data into the training data set for the model. This will assure we are not using almost all of our data for training. We used train-test-split from the sklearn library.

![image](https://user-images.githubusercontent.com/103209236/189551744-1c455e91-5df8-48b3-83ec-19babbef51bf.png)

#### Initial Model Results
In order to get an initial impression of our model we ran it on Albania. We ran predictions for the test set and compared them to actual values. 
~~~
#Actual value and the predicted value
mlr_diff = pd.DataFrame({'Actual value': y_test, 'Predicted value': y_pred_mlr})
mlr_diff.head()
~~~
![Screen Shot 2022-09-14 at 10 44 38 AM](https://user-images.githubusercontent.com/99676466/190225551-33df6c62-93ee-40b4-9e1d-41217b518b91.png)

Then we ran som statistics by importing metrics from the sklearn library and running r-squared, which returns a percentage, and measures the proportion of the variance for yields that is explained by the independent variables. So for our model, a large portion of the variance can be explained by the model inputs, or features. Because we have a large number of variables, that can contribute to a high r-squared value. To account for this overfitting, we ran some more stats to compare. The root mean squared error(RMSE), tells us how concentrated our data is around our line of best fit, or how far do our data points vary from our prediction. The RMSE value is in relation to our units which are hectagrams/hectare, so in our case is relatively small and means that the model is generally accounting for the important features very well. 

![Screen Shot 2022-09-14 at 11 55 29 AM](https://user-images.githubusercontent.com/99676466/190227647-50530f27-5e3e-4606-8dbe-fd508624264c.png)

The next model will create a nested for loop to cycle all the countries through the model, and get a predicted yield for each country in the year 2013. It can then be compared to the actual. 

#### Benefits and Drawbacks
The benefit of multivariate linear regression model is that one can predict the future based on many conditions. The limitations of this model is the assumption of linearity between the variables and the possibility for noisy data. The next model run will scale the data using the StandardScaler from the sklearn library since scaling can impact linear regression.

## Dashboard
We will be using Leaflet, an open-source JavaScript library, that facilitates the development of interactive maps. Our map will have pins for each county, with the option to filter for different crops. When you click on the country you are able to see a prediction for future crop yields.
