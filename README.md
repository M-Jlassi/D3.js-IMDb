# Description

A project I did during my studies, which shows a map of the world.  

You may click on countries and see the amount of movies produced by the country.  

This project uses the IMDb non-commercial dataset: [title.akas.tsv.gz](https://developer.imdb.com/non-commercial-datasets/#titleakastsvgz).  

# How to run the project

The following directions assume that you use Ubuntu as your OS.  

 - Clone the repository locally

```
git clone https://github.com/M-Jlassi/D3.js-IMDb.git
```

 - Navigate to the directory

```
cd D3.js-IMDb/
```

 - We will need to serve the files using a HTTP server. We will use the one provided by Python, but any will do. Download Python

```
sudo apt-get install python3
```

 - Launch the Python HTTP server

```
python3 -m  http.server 8000
```

 - In your browser, navigate to the following URL

```
http://localhost:8000/countries_map.html
```

 - Click on countries and enjoy!
