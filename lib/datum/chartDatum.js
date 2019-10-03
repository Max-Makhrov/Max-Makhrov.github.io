// 
//   ______                          _   
//  |  ____|                        | |  
//  | |__ ___  _ __   ___  ___  _ __| |_ 
//  |  __/ _ \| '__| / __|/ _ \| '__| __|
//  | | | (_) | |    \__ \ (_) | |  | |_ 
//  |_|  \___/|_|    |___/\___/|_|   \__|

// will sort by text values representing dates
// DD.MM.YY
function sortStringDateRu(a, b)
{
  a = a || "16.07.19";
  b = b || "12.08.19";
  // "Hello world!".substring(1, 4); => "ell" 
  var aa = a.substring(6, 8) + a.substring(3, 5) + a.substring(0, 2);
  var bb = b.substring(6, 8) +b.substring(3, 5) + b.substring(0, 2);
  if (aa > bb)
  {
    return 1; 
  }
  else if (aa < bb)
  {
    return -1;    
  }  
  return 0;   
}

// sort text
function sortText(a, b)
{
  if (a > b)
  { 
    return 1;
  }
  else if (a < b)
  {
    return -1; 
  }  
  return 0;    
}



//   __  __           _ _  __       
//  |  \/  |         | (_)/ _|      
//  | \  / | ___   __| |_| |_ _   _ 
//  | |\/| |/ _ \ / _` | |  _| | | |
//  | |  | | (_) | (_| | | | | |_| |
//  |_|  |_|\___/_\__,_|_|_|  \__, |
//      | |     | |            __/ |
//    __| | __ _| |_ __ _     |___/ 
//   / _` |/ _` | __/ _` |          
//  | (_| | (_| | || (_| |          
//   \__,_|\__,_|\__\__,_|                     


function getSumPivonFromArrayOfObjects(summerio)
{
  /* getSumPivonFromArrayOfObjects
  __ __  __ 
  || ||\\|| 
  || || \|| 

    var summerio = 
        {
          colSum: 'S',
          colBy: 'D',
          sortFunc: sortStringDateRu,
          colPiv: 'B',
          data: bigdata    
        };

    var bigdata = [
       {
          "S":"1",
          "B":"4. Розничный",
          "D":"12.08.19"
       },
       {
          "S":"-46",
          "B":"2. Корпоративный",
          "D":"10.07.19"
       },
       ...
       ];   

   _____  __ __ _____ 
  ((   )) || ||  ||   
   \\_//  \\_//  ||   

    [ S A M P L E  #1 ]
    summerio = 
      {
        colSum: 'S',
        colBy: 'B',
        sortFunc: sortText,
        sortLegend: sortStringDateRu,
        colPiv: 'D',
        data: bigdata,
        labelTranspose: 'Бизнес'
      }; 

      ==>
   getSumPivonFromArrayOfObjects(summerio).transposed =    
   [
     [Бизнес, 10.07.19, 11.07.19, 12.07.19, ...], 
     [2. Корпоративный, -46.0, -47.0, -116.0, ...], 
     [3. Малый и средний, 1288.0, 1124.0, 5155.0, ...]
   ] 

   [ S A M P L E  #2 ]
    var summerio = 
        {
          colSum: 'S',
          colBy: 'D',
          sortFunc: sortStringDateRu,
          colPiv: 'B',
          data: bigdata    
        };  
     ==>
     getSumPivonFromArrayOfObjects(summerio) = 
    {
      transposed=[], 
      series=[
        {
          data=[-46.0, -47.0, -116.0, ...], 
          name=2. Корпоративный
        }, 
        {
          data=[1288.0, 1124.0, 5155.0, ...], 
          name=3. Малый и средний
        }, 
          {data=[-171.0, -171.0, -515.0, ...], 
          name=4. Розничный
        }
       ], 
       legendData=[2. Корпоративный, 3. Малый и средний, 4. Розничный], 
       xAxisData=[10.07.19, 11.07.19, 12.07.19, ...]}
  */  
  //
  // summerio = summerio || {};
  var colSum = summerio.colSum;         // || 'S';
  var colBy = summerio.colBy;           // || 'D';  
  // sorts by this column?
  var sortFunc = summerio.sortFunc;     // || sortStringDateRu;
  var sortLegend = summerio.sortLegend || sortText;
  var colPiv = summerio.colPiv;         // || 'B';
  var data = summerio.data;             // || bigdata;
  var labelTranspose = summerio.labelTranspose;
  //
  var series = [];
  //    series: [{
  //        name: '2. Корпоративный',
  //        data: data1
  //    }, {
  //        name: '3. Малый и средний',
  //        data: data2
  //    }, {
  //        name: '4. Розничный',
  //        data: data3
  //    }  
  var xAxisData = [];
  var legendData = [];
  //
  var keysPiv = {}, sumData1 = {}, node1 = {}, row = {}, key1, key2, node2 = {}, sum;
  var keysPiv = {};
  // loop data
  for (var i = 0; i < data.length; i++)
  {
    row = data[i];      //    { "S":"1", "B":"4. Розничный","D":"12.08.19" }
    key1 = row[colBy];  //    "12.08.19"
    key2 = row[colPiv]; //    "4. Розничный"
    //
    sum = parseInt(row[colSum]); // 1.0
    //
    // node with column sum by
    if (key1 in sumData1)
    {
      node1 = sumData1[key1];
    }
    else 
    {
      node1 = {};
    }
    //
    // node with column pivot
    if (key2 in node1)
    {
      node2 = node1[key2];
      node2.sum += sum;
    }
    else
    {
      node2 = {};
      node2.sum = sum;
    }
    //
    // add to vals
    node1[key2] = node2;
    sumData1[key1] = node1;
    //
    // add key2 to keysPiv
    if (!(key2 in keysPiv))
    {
       keysPiv[key2] = key2;     
    }
    
  }
  //  
  //
  // get array of keys and sort it
  var keysArr = Object.keys(sumData1);
  if (sortFunc) { keysArr.sort(sortFunc); } 
  xAxisData = keysArr;
  legendData = Object.keys(keysPiv);
  //
  // sort series to order them the same
  legendData.sort(sortLegend);  
  //
  // get datasets for series
  var key, node, serialDatas = [], s, dataSet, subNode = {};
  for (var i = 0; i < xAxisData.length; i++)
  {
    key = xAxisData[i];
    node = sumData1[key];
    
    for (var ii = 0; ii < legendData.length; ii++)
    {
      subNode = node[legendData[ii]] || {};      
      s = subNode.sum || 0;
      dataSet = serialDatas[ii] || [];      
      dataSet.push(s);
      serialDatas[ii] = dataSet;      
    }    
  }
  //
  //
  // get series
  for (var ii = 0; ii < legendData.length; ii++)
  {
    series.push({name: legendData[ii], data: serialDatas[ii]});
  }
  //
  //
  // transpose data if needed
  var transposed = [];
  var elt = [], part = [];
  if (labelTranspose)
  {
    elt = JSON.parse(JSON.stringify(legendData));
    elt.unshift(labelTranspose); // get the first row
    transposed.push(elt);
    //
    // loop series
    for (var i = 0; i < series.length; i++)
    {
      part = series[i].data;
      // loop part
      for (var ii = 0; ii < part.length; ii++)
      {
        if (i === 0)
        {
          transposed.push([xAxisData[ii], part[ii]]);
        }
        else
        {
          transposed[ii+1].push(part[ii]);
        }
      }
    }    
  } 
  //
  var result = {
    xAxisData: xAxisData,
    legendData: legendData,
    series: series,
    transposed: transposed
  };
  //
  // Logger.log(result);
  //{transposed=[], 
  //     series=[
  //     {data=[-46.0, .0, -45.0, -46.0, -46.0, -46.0, -183.0, -46.0, -22.0], 
  //      name=2. Корпоративный}, 
  //     {data=[1288.0, 1124.0,  1088.0, 3307.0, 1090.0, 2777.0, 1121.0, 1092.0], 
  //      name=3. Малый и средний}, 
  //     {data=[-171.0, -171.0, -515.0, -172.0, -172.0521.0, -170.0, -171.0, -171.0], 
  //      name=4. Розничный}], 
  //
  //     legendData=[2. Корпоративный, 3. Малый и средний, 4. Розничный], 
  //
  //     xAxisData=[10.07.19, 11.07.19, 12.07.19, 15.07.19, 16.07.19, 17.07.19]}  
  return result;
}




function parseRoundThousand(num)
{
  return Math.round(parseInt(num) / 1000); 
}



/////////////////////////////
///////////////////////////
////////////////////////
//////////////////////
//////////////////
///////////////
//////////////
////////////
///////////
//////////
/////////
////////
///////
//////
/////
////
///
//
//
//
// { arr=[[Cat1, 4.5], [Cat2, 6.0], [Cat3, 3.0]], }
//   obj={ Cat3={sum=3.0, collection=[4.0]}, 
//         Cat2={sum=6.0, collection=[2.0, 3.0]}, 
//         Cat1={sum=4.5, collection=[1.0]}
//   waterfall={minus=[-, -, 3.0], 
//              invisible=[0.0, 4.5, 3.0], 
//              plus=[4.5, 1.5, -]}
// }
function gruopObjectSum_(summo)
{
   var objCollection = summo.objCollection;
  var colBy = summo.colBy;
  var colSum = summo.colSum;
  var sortF = summo.sortF;
  var numF = summo.numF;
  
  // convert to array
  var data = [], sumE;
  for (var i = 0; i < objCollection.length; i++)
  {
    sumE = objCollection[i][colSum];
    if (numF) { sumE = numF(sumE); }
    data.push([objCollection[i][colBy], sumE]);     
  }
  var summer = {data: data, idBy: 0, idSum: 1, sortF: sortF};
  var res = getGroupedSum_(summer);
  return res;
}



// smart summer
function getGroupedSum_(summer)
{
  var data = summer.data;
  var idBy = summer.idBy;
  var idSum = summer.idSum;
  var idCollect = summer.idCollect;
  var sortF = summer.sortF;
  
  // data, idBy, idSum
  var res = {};
  var o = {}, node = {}, collection = {};
  for (var i = 0; i < data.length; i++)
  {
    var row = data[i];
    var key = row[idBy];
    var s = row[idSum];
    if (!(key in o))
    {
      node = {};
      node.sum = s;
      if (idCollect) 
      { 
        collection = {};
        collection[row[idCollect]] = row[idCollect]; 
        node.collection = collection;
      }
      o[key] = node;
    }
    else
    {
      node = o[key];
      node.sum += s;
      if (idCollect) 
      { 
        collection = node.collection;
        collection[row[idCollect]] = row[idCollect]; 
        node.collection = collection;
      }
      o[key] = node; 
    }
  };
  
  var a = [], newCollection = [];
  // get summed array and correct collections
  var waterfall = {};
  waterfall.invisible = [];
  waterfall.plus = [];
  waterfall.minus = [];
  waterfall.legend = [];
  var initVal = 0;
  
  var oKeys = Object.keys(o);
  if (sortF)
  {
    // sort... 
    oKeys.sort(sortF);
  }
  
  
  var key = '';
  for (var i = 0; i < oKeys.length; i++)
  {
    key = oKeys[i];
    // get summed array
    a.push([key, o[key].sum]);
    
    // get waterfall
    if (o[key].sum >= initVal)
    {
      waterfall.invisible.push(initVal);
      waterfall.plus.push(o[key].sum - initVal);
      waterfall.minus.push('-');    
    }
    else
    {
      waterfall.invisible.push(o[key].sum);
      waterfall.plus.push('-');
      waterfall.minus.push(initVal - o[key].sum);           
    }
    initVal = o[key].sum;
    waterfall.legend.push(key);
    
   
    
    // correct collections
    newCollection = [];
    collection =  o[key].collection;
    for (var k in collection)
    {
      newCollection.push(collection[k]);
    }
    o[key].collection = newCollection;
    
  }
    
  res = 
    {
      obj: o,
      arr: a,
      waterfall: waterfall
    }
   
  return res;	
}

// \\\
// \\\\\
// \\\\\\\
// \\\\\\\\
// \\\\\\\\\
// \\\\\\\\\\\
// \\\\\\\\\\\\\
// \\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



function functioner(i)
{
  var self = this;
  this.i = i 
  
  this.animationDelay = function(idx) {
    return idx * 10 + 100 * self.i;    
  }    
}

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ F U N C T I O N S 
