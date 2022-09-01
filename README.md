# Crop Yield Analysis

## Topic Selection

Our group selected the topic of crop yield, which is based on different factors such as the rain fall, temperature, and pesticides. Agriculture is a critical role in the global economy and understanding it can help solve global challenges, such as food security and reducing impact of climate change. We were interested in the crop yield data and wanted to determine what conditions create the best crop yield and which conditions have a higher effect on which countries yield the most crops for the year. The data source is from Kaggle, which uses the publicly available datasets from Food and Agriculture Organization (FAO) and World Data Bank.

The data can be found at https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset

## Questions we Hope to Answer
- Which country has the best conditions to yield the most crop consistently overtime and has climate change impacted crop yield in recent times?
- Which factors are the most important for impacting the highest crop yield?
- How can countries maximize their crop yield based on the important factors considered?

## Communication Protocols
Our group will utilize Slack, text messages, and Zoom meetings to keep communication open between all five group members. This way if a team member has a question or needs help outside of designated class meeting hours, they can post a message in slack, meet up with a team member(s) in Zoom or send a text for a more immediate response. One team member is in a different time zone, two hours behind the other team members; the team recognizes this potential issue and will plan meetings ahead of time utilizing evenings and weekends. Our group will divide tasks between the five group members and remain open to different forms of communication if necessary or if something is not working.

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
