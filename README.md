# Crop Yield Analysis

## Topic Selection

Our group selected the topic of crop yield, which is based on different factors such as temperature, nutrients, land use, and pesticides. Agriculture is a critical role in the global economy and understanding it can help solve global challenges, such as food security and reducing effects on and impact of climate change. Between the pandemic, the war in Ukraine, climate disasters, and inflation driving higher food prices, food scarcity is a topic at the forefront of the global economic and political landscape. With agriculture as a leading industry in numbers of employees and accounting for trillions of dollars in the global economy, crop yields have far reaching impacts. It is an industry that both contributes to and is impacted by climate change. We were interested in the crop yield data and wanted to determine what conditions create the best crop yield and which conditions have a higher effect on which countries yield the most crops for the year.

## Presentation
[Google Slides](https://docs.google.com/presentation/d/1yNYFJbbcBUawSA2hxCAlpLkM5uCbDq4VjPKTMF9JWZk/edit?usp=sharing)
![Screen Shot 2022-09-17 at 12 26 35 PM](https://user-images.githubusercontent.com/99676466/190871420-c9a9ad9f-5d37-4b06-9c2b-bf799db1fb10.png)

## Data Selection
We originally selected data from [kaggle](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset), but realized the rainfall data was all the same values. So we got data from the [Food and Agriculture Organization (FAO)](https://www.fao.org/faostat/en/#data/domains_table), where we were able to select data from variables we thought would be interesting. These include:
* [Agricultural and Arable Land](https://www.fao.org/faostat/en/#data/RL)
* [Nutrient Application: Nitrogen, Phosophate,Potash](https://www.fao.org/faostat/en/#data/RFN)
* [Pesticides](https://www.fao.org/faostat/en/#data/RP)
* [Temperature](https://www.fao.org/faostat/en/#data/ET)
* [Crop yields](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset)

In order to create a map for our dashboard we also added [latitude and longitude data](https://developers.google.com/public-data/docs/canonical/countries_csv)

## Questions we Hope to Answer
- Which countries produce the most crop yield per crop? 
- What conditions affected crop yield the most?
- Using the data, can we accurately predict how much yield counties will produce in the future??

## Tools and Technologies
Python, Pandas, Jupyter Notebooks, Postgresql, SQL, SQLALchemy, sklearn, matplotlib, Leaflet, Mapbox, Tableau, Javascript, html/css

### Data Exploration Phase
During our exploratory data analysis we created a function to clean all the datasets that we import from the FAO website. This included dropping null values, dropping duplicates, and discovering which years there was adequate data for. We used inner joins/merging of tables to determine where there was adequate data. We determined there was sufficient data during the years 2008-2013. We were able to loop through the data and add previous years data as features that could influence that year's yields. Different countries had data entered under different names, so we had to go through and match names with str.replace() so we wouldn't have duplicate countries. For example, we had to change all the following countries:
~~~
def clean_countries(df):
    df['area'] = df['area'].str.replace("Türkiye", "Turkey")
    df['area'] = df['area'].str.replace("United Kingdom of Great Britain and Northern Ireland", "United Kingdom")
    df['area'] = df['area'].str.replace("The former Yugoslav Republic of Macedonia", "North Macedonia")
    df['area'] = df['area'].str.replace("Bolivia (Plurinational State of)", "Bolivia", regex=False)
    df['area'] = df['area'].str.replace("China, mainland", "China", regex=False)
    df['area'] = df['area'].str.replace("Iran (Islamic Republic of)", "Iran", regex=False)
    df['area'] = df['area'].str.replace("Republic of Moldova", "Moldova")
    df['area'] = df['area'].str.replace("Russian Federation", "Russia")
    df['area'] = df['area'].str.replace("Republic of Korea", "South Korea")
    df['area'] = df['area'].str.replace("Syrian Arab Republic", "Syria")
    df['area'] = df['area'].str.replace("China, Taiwan Province of", "Taiwan")
    df['area'] = df['area'].str.replace("United Republic of Tanzania", "Tanzania")
    df['area'] = df['area'].str.replace("United States of America", "United States")
    df['area'] = df['area'].str.replace("Venezuela (Bolivarian Republic of)", "Venezuela", regex=False)
    df['area'] = df['area'].str.replace("Viet Nam", "Vietnam")
    df['area'] = df['area'].str.replace("Côte D'Ivoire", "Côte d'Ivoire")
    df['area'] = df['area'].str.replace("Czech Republic", "Czechia")
    df['area'] = df['area'].str.replace("Congo (Democratic Republic Of The)", "Democratic Republic of the Congo", regex=False)
    return df
 ~~~   

### Data Analysis Phase
During our data analysis phase we continued to pair down the data by using str.replace() to match all country names and correct variations in spelling. At this point there were 106 countries we used for our analysis. The crops value_counts for those countries are as follows:

![Screen Shot 2022-09-11 at 6 14 38 PM](https://user-images.githubusercontent.com/99676466/189555201-28ee5f96-056c-467d-b92e-7256e2e5d6a0.png)

Potatoes had the highest yields and the top countries for producing potatoes were Belgium, New Zealand, France, Switzerland, and the United States, with New Zealand being the most consitent over the years we looked at for high potato yields.

![Screen Shot 2022-09-17 at 12 39 23 PM](https://user-images.githubusercontent.com/99676466/190871876-dd623eb8-ab26-4402-a787-a21644d9e3c9.png)

The countries with the highest yields of maize were the Netherlands and Tajikistan. The countries producing the highest wheat yields consistently were Ireland, Belgium, and the Netherlands. Every year Turkey produced the most soybeans. Algeria, Italy, and France consistently produce the most sorghum. Senegal, Australia, and Egypt produce the most sweet potatoes. Mali and Japan produce the most yams and India produces the most cassava. And Australia and Egypt produce the most rice paddies. Finally, Suriname and El Salvador produce the most plantians and other crops, which is bucketed together in this one category. Interestingly, though not surprisingly, it looks like the U.S. leads in use of pesticides and fertilizers. More pesticide and fertilizer use does not account for higher yields after a certain point, and this is an area that could be honed in on more with further research. 

The exploratory and analysis phases both took longer and were more complicated than we had originally planned for.

## Database

![Crop_Yield_Analysis Entity Relationship Diagram](https://user-images.githubusercontent.com/99676466/190865732-9dae519d-692a-49f6-81e4-330e7c46c578.png)

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
In Postrges, we checked that the tables imported properly, then the 9 tables were joined using inner joins and the columns were renamed to avoid confusion with the values as seen in the join_query.sql file. Then we checked that the number of countries matched the number of countries in our clean_data.ipynb, which was 106. There were three countries from the lat_long table that needed str.replace to match the other tables so the data would not be lost. After this there were 106 countries. The fully joined table was named total_yields and exported as a csv. To import the total_yields table back into a notebook to use for the machine learning preprocessing and subsequent model run, we used the same connection string and create engine code as above followed by Pandas read_sql_table() method:
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
  - How much a country's land is dedicated to agriculture
  - How much of a country's land is arable (able to be farmed). 

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

Then we ran some statistics by importing metrics from the sklearn library and running r-squared, which returns a percentage, and measures the proportion of the variance for yields that is explained by the independent variables. So for our model, a large portion of the variance can be explained by the model inputs, or features. Because we have a large number of variables, that can contribute to a high r-squared value. To account for this overfitting, we ran some more stats to compare. The root mean squared error(RMSE), tells us how concentrated our data is around our line of best fit, or how far do our data points vary from our prediction. The RMSE value is in relation to our units which are hectagrams/hectare, so in our case is relatively small and means that the model is generally accounting for the important features very well. 

![Screen Shot 2022-09-14 at 11 55 29 AM](https://user-images.githubusercontent.com/99676466/190227647-50530f27-5e3e-4606-8dbe-fd508624264c.png)

In order to help determine which features most influence crop yields, we ran some statistics on the linear regression, Albania model. The P-value helps us to determine which features are most important. To use these statics we imported statsmodels and used the ordinary least squares(OLS) method:
~~~
import statsmodels.api as sm
mod = sm.OLS(y, x)    # Describe model
res = mod.fit()       # Fit model
print(res.summary())   # Summarize model
~~~
The only feature with a p-value below the standard alpha value of .05 was the previous years yield. Some of the features with lower p-values included previous three years average temperature and tonnes of potash. Amount of agricultural land could also be factored in. If more of these features had p-values below the alpha, they would be determined statistically significant and we could drop some of the features with higher values. Future work could include p-values for all countries. 

The next model will create a nested for loop to cycle all the countries through the model, and get a predicted yield for each country in the year 2013. It can then be compared to the actual. 

#### Benefits and Drawbacks
The benefit of multivariate linear regression model is that one can predict the future based on many conditions. The limitations of this model is the assumption of linearity between the variables and the possibility for noisy data. The next model run will scale the data using the StandardScaler from the sklearn library since scaling can impact linear regression.

## Machine Learning Model- Week 3
Our work continued with our model by creating a for loop to loop through each country and run a linear regression to predict the yield for the year 2013. The result is a dataframe with predictions, what the actual yield was for 2013 and the difference between the two. The best way for us to calculate accuracy score was to calclated percent error which we have done for each countries model. 
~~~
predictions_df = pd.DataFrame(columns = ['area', 'crop', 'lat', 'long', 'yield_2013', \
                                         'yield_2013_pred', 'yield_2013_diff', 'perc_err'])

for country in countries:
    country_rows = df[df['area'] == country]
    crops = country_rows['crop'].unique()
    for crop in crops:
        crop_rows = country_rows[country_rows['crop'] == crop] #rows = 6
        
        crops_08_12 = crop_rows[crop_rows['year'] != 2013] #rows = 5
        x = crops_08_12[['yield_1', 'yield_2', 'yield_3', 'yield_4', 'yield_5', \
                   'avg_temp', 'avg_temp_1','avg_temp_2','avg_temp_3', 'avg_temp_4', 'avg_temp_5', \
                   'tonnes_potash', 'tonnes_potash_1', 'tonnes_potash_2', 'tonnes_potash_3', \
                   'tonnes_phosph', 'tonnes_phosph_1','tonnes_phosph_2', 'tonnes_phosph_3', \
                   'tonnes_pesticide', 'tonnes_pesticide_1', 'tonnes_pesticide_2', 'tonnes_pesticide_3', \
                  'tonnes_nitrogen', 'tonnes_nitrogen_1', 'tonnes_nitrogen_2', 'tonnes_nitrogen_3', \
                  'arable_land', 'ag_land']]
        y = crops_08_12['yield']
        
        #x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.3, random_state = 100)
        
        scaler = StandardScaler()
        x_scaler = scaler.fit(x)
        #x_scaler = scaler.fit(x_train)
        #x_train_scaled = x_scaler.transform(x_train)
        #x_test_scaled = x_scaler.transform(x_test)
        x_train_scaled = x_scaler.transform(x)
        y_train = y
        
        mlr = LinearRegression()
        mlr.fit(x_train_scaled, y_train)
        
        crops_13 = crop_rows[crop_rows['year'] == 2013] #rows = 1
        x_test = crops_13[['yield_1', 'yield_2', 'yield_3', 'yield_4', 'yield_5', \
                   'avg_temp', 'avg_temp_1','avg_temp_2','avg_temp_3', 'avg_temp_4', 'avg_temp_5', \
                   'tonnes_potash', 'tonnes_potash_1', 'tonnes_potash_2', 'tonnes_potash_3', \
                   'tonnes_phosph', 'tonnes_phosph_1','tonnes_phosph_2', 'tonnes_phosph_3', \
                   'tonnes_pesticide', 'tonnes_pesticide_1', 'tonnes_pesticide_2', 'tonnes_pesticide_3', \
                  'tonnes_nitrogen', 'tonnes_nitrogen_1', 'tonnes_nitrogen_2', 'tonnes_nitrogen_3', \
                  'arable_land', 'ag_land']]
        x_test_scaled = x_scaler.transform(x_test)
        y_test = crops_13['yield']
        pred_13 = mlr.predict(x_test_scaled)
        perc_err = np.abs((y_test - pred_13) / y_test * 100)
        
        #pred_08_12 = mlr.predict(x_test_scaled)
        #rmse = np.sqrt(metrics.mean_squared_error(y_test, pred_08_12))
        #rsq = mlr.score(x_test_scaled, y_test)*100
        #rsq = mlr.score(x_pred_scaled, y_actual)*100
        
        row = {'area': country, 'crop': crop, 'lat':crops_13['latitude'], 'long':crops_13['longitude'], 'yield_2013': y_test, 'yield_2013_pred': pred_13,\
               'yield_2013_diff': y_test - pred_13, 'perc_err': perc_err}
        row_df = pd.DataFrame(row)
        predictions_df = pd.concat([predictions_df, row_df], axis=0, ignore_index=True)
predictions_df
~~~

![Screen Shot 2022-09-15 at 9 43 32 AM](https://user-images.githubusercontent.com/99676466/190448039-02a4a906-9e69-4626-8826-025e2d8e4213.png)

Then we decided the best statistical assessment of the results was to calculate the percent error between the prediction and the actual. The model on average preformed pretty well; the average percent error was 28.66% but is reduced to 15% when the biggest outlier is removed. The Côte d'Ivoire had an extreme outlier in predicted yield for sweet potatoes with a percent error of 8484.30%. The median percent error is perhaps more telling at 6.8%. There were a few other outliers that were over 100% error. Looking at the data for the Côte d'Ivoire, it appears that there was in increase in nutrients applied which could account for the model increase in yield prediction. 

![Screen Shot 2022-09-15 at 9 45 29 AM](https://user-images.githubusercontent.com/99676466/190448588-854edacd-e295-428d-9d4d-de3becaa3de6.png)

In this model run we scaled the data with StandardScaler from the sklearn library, but because of the nature of the dataframe and its structure, and our selection of using a span of five years to prediction the sixth year, a choice to make more of a forecasting model than a predictive one, we only had a few data points for each country. This meant that rather than using train_test_split(), the model used the data points as the training data and the forecasted point as the testing data. 


## Dashboard
By outputting latitude and longitude in the predictions_df from our third model, we were able to convert the csv of that dataframe to a geoJson to help us create an interactive map using Mapbox and Leaflet. Leaflet, an open-source JavaScript library, facilitates the development of interactive maps. Our map has icons for each county that correspond to the crop, with the option to filter the layer for different crops. When you click on the country or crop icon you are able to see a prediction for future crop yields, actual yield and the percent error in the model. [Leaflet](https://reldrid3.github.io/Crop_Yield_Analysis/leaflet/index.html)

![Screen Shot 2022-09-15 at 9 54 44 AM](https://user-images.githubusercontent.com/99676466/190450640-acd0650e-cddd-4af1-bfcc-9d14941c6d53.png)

To visualize the percent error and differences between predicted and actual yields we also created a [dashboard](https://public.tableau.com/app/profile/courtney.stern/viz/Crop_Yield_Final_Project/Dashboard1?publish=yes) in Tableau public. The interactive dashboard allows the user to select different countries or crops and reduce the noise from the outliers with a slider. 

![Screen Shot 2022-09-15 at 9 34 11 AM](https://user-images.githubusercontent.com/99676466/190446148-068d0828-c38e-471a-aea1-8f19b6a2a3bd.png)

## Recommendations for Future Analysis
It would be worth expanding the model in future work by including more data points by using more years. With this we would also want to continue modelling for best feature selection, so we could reduce features that were not statistically significant. To do this we would expand out statistical analysis including p-values on features for each countries model. Running another model such as a neural network or a different regression model such as a polynomial regression that might be a little more flexible to account for non-linearities would be future work that we would complete.  
 
* One question worth addressing in future work: at what point does more fertilizer and pesticide application cease to increase yields? 

## What would we have done differently 
Our biggest challenge once we cleaned the data, was that to show correlation we had to filter out and run the model on each country which further reduced the amount of data for each crop. 

#### Technical or other Challenges
Finding complete data was a challenge we had. As soon as we realized the rainfall data was repetitive and uninformative, we realized it was hard to find data for each country that was complete enough to add to the analysis we had. Finding complete data for other factors also proved challenging.
