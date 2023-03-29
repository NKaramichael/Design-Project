from bs4 import BeautifulSoup

# read the contents of the HTML file into a string
with open('signup.html', 'r') as f:
    html_string = f.read()

# parse the HTML string with BeautifulSoup
soup = BeautifulSoup(html_string, 'html.parser')

# find the input element and get its value
input_element = soup.find('input', {'name': 'email'})
username = input_element['value']

# use the input data in your Python code
print(f'The username entered was {username}')