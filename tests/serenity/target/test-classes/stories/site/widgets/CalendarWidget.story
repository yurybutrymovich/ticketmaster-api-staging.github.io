Meta:

Narrative:
In order to setup Calendar Widget
As a developer
I want to use the widget configurator to customize the layout of the widget,
and have ability to grab a small code snippet to insert into 3-rd party websites

Scenario: (/products-and-docs/widgets/calendar/) TECHNICAL TAB - Check that required fields are not empty
Given open Calendar Widget page
Then the required fields are not empty on the Calendar Widget page

Scenario: (/products-and-docs/widgets/calendar/) TECHNICAL TAB - Check that embed code functionality works properly
Given open Calendar Widget page
And change values for: apiKey,keyword,postalCodeApi
And store values of: apiKey,keyword,postalCodeApi
When click on "Get code" button
Then the pop-up Embedded Code is opened
And embedded html code contains stored values of: apiKey,keyword,postalCodeApi

Scenario: (/products-and-docs/widgets/calendar/) TECHNICAL TAB - Check RESET button functionality
Given open Calendar Widget page
And store values of: apiKey,keyword,postalCodeApi
And change values for: apiKey,keyword,postalCodeApi
When click reset button
Then values of fields: apiKey,keyword,postalCodeApi equals stored values

Scenario: (/products-and-docs/widgets/calendar/) Check RESET button functionality on Embedded Code Pop-up window
Given open Calendar Widget page
And store values of: apiKey,keyword,postalCodeApi
And change values for: apiKey,keyword,postalCodeApi
When click reset button on Calendar Widget Page
And click on "Get code" button
Then the pop-up Embedded Code is opened
And embedded html code contains stored values of: apiKey,keyword,postalCodeApi

Scenario: (/products-and-docs/widgets/calendar/) TECHNICAL TAB - Check links
Given open Calendar Widget page
When I click on the 'Get your own' link to get api key
Then The page is opened with url https://developer-acct.ticketmaster.com

Scenario: (/products-and-docs/widgets/calendar/) Event message - Check event message for invalid API Key
Given open Calendar Widget page
And enter custom ApiKey invalidApiKey123
Then the event message is shown "No results were found"
