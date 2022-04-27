//fetch the cryptocurrency data and store it inside the variable called data

    var xhReq = new XMLHttpRequest();
    xhReq.open("GET","https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", false);
    xhReq.send(null);
    var data = JSON.parse(xhReq.responseText);

    //initialization
    var cryptocurrencies; //global variable
    var timerId;
    var updateInterval = 10000; //interval of value ranking every 30sec


    //so that the values are adjusted according to the volume%24hs, we declare the following function:
    function descending(a,b){return a.percentage_change_24h < b.percentage_change_24h? 1 : -1;}
    function ascending(a,b){return a.percentage_change_24h > b.percentage_change_24h? 1 : -1;}

    function reposition(){
      var height = $("#cryptocurrencies .cryptocurrency").height();
      var y = height;
      for (var i = 0; i< cryptocurrencies.length; i++){
        cryptocurrencies[i].$item.css("top", y + "px");
        y += height;
      }
    }

    function updateRanks(cryptocurrencies){
      for (var i = 0; i< cryptocurrencies.length; i++){
          cryptocurrencies[i].$item.find(".rank").text(i+1);
    }
  }
    function getRandomScoreIncrease(){
      return getRandomBetween(10,20);

  }
    function getRandomBetween(min,max){
      return Math.floor(Math.random() * max) + min;
  }
    function fetchNewData(data,attributeName,name){
      for (var x in data){
        if((data[x].name == name) == true) {
          return data[x][attributeName];
        }
      }
      return null;
    }
    function getNewData(){
      //get new data for each coing and change their new values

      var newReq = new XMLHttpRequest();
      newReq.open("GET","https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", false);
      newReq.send(null);
      var newData = JSON.parse(newReq.responseText);
////////////////////////////////
      for (var i = 0; i< cryptocurrencies.length; i++){
        var cryptocurrency = cryptocurrencies[i];
       // cryptocurrency.percentage_change_24h += getRandomScoreIncrease();
        cryptocurrency.percentage_change_24h += fetchNewData(newData,'percentage_change_24h',cryptocurrency.name);
        cryptocurrency.$item.find(".percentage_change_24h").text(cryptocurrency.percentage_change_24h);
      }
      ////////////////////////////////////
      cryptocurrencies.sort(descending);
      updateRanks(cryptocurrencies);
      reposition();

        console.log('refreshing');
  }

    function resetBoard(){
        var $list = $("#cryptocurrencies") //initialize the list with the id of cryptocurrencies in the Html file
        $list.find(".cryptocurrency").remove(); //we have to remove it every time the new data of the api it0s gonna update, so we can show the latest ranking
      
        if(timerId !== undefined){
          clearInterval(timerId);
        }
        
        cryptocurrencies = [];
        for(let i = 0; i<25; i++){
            cryptocurrencies.push ( /*this up there gonna use it to deploy the list of data*/
                {
                  name: data [i].name,
                  symbol: data[i].symbol,
                  price: data[i].current_price,
                  market_cap: data[i].market_cap,
                  circulating_supply: Math.round(data[i].circulating_supply),
                  volume_24h: data[i].total_volume,
                  percentage_change_24h: data[i].market_cap_change_percentage_24h,
              }
            )
        }
        //string concatination of the tag to put all with the data in the table
        for(var i=0;i<cryptocurrencies.length;i++){
          var $item = $(
            "<tr class= 'cryptocurrency'>" + 
            "<th class= 'rank'>" + (i+1)+"</th>" +
            "<td class= 'name'>" +  cryptocurrencies[i].name + "</td>"+
            "<td class= 'symbol'>" +  cryptocurrencies[i].symbol + "</td>"+
            "<td class= 'price'>" +  cryptocurrencies[i].price + "</td>"+
            "<td class= 'market_cap'>" +  cryptocurrencies[i].market_cap + "</td>"+
            "<td class= 'circulating_supply'>" +  cryptocurrencies[i].circulating_supply + "</td>"+
            "<td class= 'volume_24h'>" +  cryptocurrencies[i].volume_24h + "</td>"+ 
            "<td class= 'percentage_change_24h'>" +  cryptocurrencies[i].percentage_change_24h + "</td>"+ 
            "</tr>"
          );
          cryptocurrencies[i].$item = $item;
          //append to the list
          $list.append($item);
        }
        cryptocurrencies.sort(descending);
        updateRanks(cryptocurrencies);
        reposition();
        // Here fetch new data for every updateInterval
        timerId = setInterval("getNewData();", updateInterval);
    }
    resetBoard();