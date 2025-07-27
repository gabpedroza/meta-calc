# Technical Explanation of Data Valuation Model

This document outlines the methodology and underlying assumptions used to estimate the hourly monetary value of a user's data to platforms like Instagram. The model is designed for transparency and is based on publicly available advertising revenue data and user engagement metrics.

## The Valuation Model

The core of our valuation is a multiplicative model, where a base hourly value is adjusted by several demographic and behavioral factors. The formula is as follows:

```
Estimated_Value = Base_Hourly_Value × Geolocation_Factor × Device_Factor × Age_Gender_Factor × Usage_Factor
```

## Factors Considered

### 1. Base Hourly Value

The **Base Hourly Value** represents the foundational revenue generated per user per hour, before any specific demographic or behavioral adjustments. This is derived from the platform's reported Average Revenue Per Person (ARPP) and estimated average daily engagement time.

For Instagram, while precise hourly ARPU is not directly disclosed, industry analyses and financial reports from Meta (Instagram's parent company) provide insights into overall ad revenue and active user bases. We estimate a conservative base hourly value of **$0.27 USD**. This figure is an approximation based on:

*   Instagram's reported annual advertising revenue (e.g., [Meta's Form 10-Q for 2025Q1](https://d18rn0p25nwr6d.cloudfront.net/CIK-0001326801/69c84e73-5862-4f7e-b0c5-823310c5bb43.pdf)).
*   Estimated average daily time spent on the platform (e.g., [Cropink, citing eMarketer](https://cropink.com/time-spent-on-instagram-statistics)).

This base value serves as a starting point, reflecting the general monetization capacity of an average user's engagement.

### 2. Geolocation Factor

The **Geolocation Factor** accounts for the significant variance in advertising rates across different geographical regions. Advertisers typically pay more for impressions and clicks from users in economically developed regions with higher purchasing power. This is a standard practice in digital advertising, where Cost Per Mille (CPM) and Cost Per Click (CPC) rates are geographically segmented.

Multipliers are derived from Meta's 2023 report, which, although rather old, should give a good enough estimate ([Meta's Form 10-Q for 2023Q3](https://www.sec.gov/Archives/edgar/data/1326801/000132680123000103/meta-20230930.htm)).

| Country Code (ISO 3166-1 alpha-2) | Multiplier | 
| :--------------------------------- | :--------- | 
| United States and Canada           | x5.0       | 
| Europe                             | x1.7       | 
| Asia-Pacific                       | x0.47      | 
| Rest of the world                  | x0.38      | 

### 3. Device Factor

The **Device Factor** reflects the differential value assigned to users based on the type of device they use to access the platform. Devices may reflect socio-economic status; but they may also have different data acquisition policies. Therefore, we employ different multipliers for each region, based on reference countries: 

These multipliers are based on market share, whose source is given in the table, and OS value estimates through [Appodeal's benchmark](https://appodeal.com/benchmarks/). The benchmark was evaluated for a "Social" app, for the latest date, in interstitial ads, for "overall" app size (or the large).

|Region  | Device Type | Multiplier | Source        |
| :----- | :---------- | :--------- | :------------ |
|US+CA| iPhone | x0.81       | Ref: US; [Backlinko citing StatCounter](https://backlinko.com/iphone-vs-android-statistics#i-phone-vs-android-market-share-in-the-us)|
|US+CA| Android     | x1.24       | -- |
|EU| iPhone | x0.98       | Ref: UK; [Kantar](https://www.kantar.com/campaigns/smartphone-os-market-share)|
|EU| Android     | x1.15       | -- |
|A-P| iPhone | x1.18       | Ref: India; [Statista](https://www.statista.com/statistics/1440084/india-apple-and-android-phones-market-share/)|
|A-P| Android     | x0.99       | -- |
|W| iPhone | x1.13       | Ref: Turkyie; [Statista](https://www.statista.com/statistics/1316551/turkey-market-share-of-mobile-operating-systems/)|
|W| Android     | x0.97       | -- |
|All | Unknown     | x1.0       | Baseline. |

### 4. Age and Gender Factor

The **Age and Gender Factors** incorporates the demographic targeting preferences of advertisers. 

#### Age 
This was sourced from the cost-per-view found [StoreGrowers citing Strike Social](https://www.storegrowers.com/youtube-ads-benchmarks/). The data is for YouTube in 2018, therefore it is quite unreliable. But it could be a useful gauge.

| Age bucket | Multiplier |
| :------------------ | :--------- | 
| Age 18-24           | x0.96      | 
| Age 25-34           | x1.2       | 
| Age 35-44           | x1.08      | 
| Age 45-54           | x1.2       | 
| Age 55-64           | x0.96      | 
| Age 65+             | x0.92      | 

### Gender
This was sourced from [Lebesgue.io](https://lebesgue.io/facebook-ads/facebook-cpm-by-gender). The data if for Facebook, Jan/2024, but should be a good gauge.

| Gender | Multiplier |
| :------------------ | :--------- | 
| Female              | x1.2       | 
| Male                | x0.85      | 


### 5. Usage Behavior Factor

The **Usage Behavior Factor** accounts for how a user's interaction patterns on the platform influence their value. Different posts engage users to different extents, which therefore changes the value of the users' attention.

These multipliers are based on [Social insider](https://www.socialinsider.io/social-media-benchmarks/instagram).

| Usage Type          | Multiplier |
| :------------------ | :--------- | 
| Reels               | x1.0       |
| Single-image posts  | x0.9       | 
| Multiple-image posts | x1.1      | 

## Disclaimer

It is crucial to understand that this model provides an *estimation* based on publicly available aggregated data and general advertising principles. The actual value of an individual user's data to Instagram (or any platform) is proprietary and highly complex, involving real-time bidding, granular targeting, and dynamic market conditions. This tool is intended for educational and awareness purposes only, to illustrate the concept of data monetization and disincentivise social media use.

Done by a LLM + human who is not a webdev.
