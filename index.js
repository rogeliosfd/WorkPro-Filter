// $.ajax({
//     url: "https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/default/public/values?alt=json",
//     method: "GET",
//     crossdomain: true,
//     success: function (data) {
//         var gsxData = data.feed.entry;
//         //console.log(p);

//         //Call all arrays
//         let result = gsxData.reduce(function (h, obj) {
//             h[obj.gsx$maincategory.$t] = (h[obj.gsx$maincategory.$t] || []).concat(obj);
//             return h;
//         }, {});

//         console.log(result);

//         for (var key in result) {
//             if (result.hasOwnProperty(key)) {

//                 //dynamic maincategs & subcategs
//                 // let content = `<div class="categWrap">
//                 // <div class="mainCateg">${key}</div>
//                 // <div class="subCategWrapper">
//                 // ${createCateg(result[key])}
//                 // </div>
//                 // <div>`;

//                 // $('.mainCategWrapper').append(content);

//                 //fixed maincategs & dynamic subcategs
//                 createSubCategs(result[key])
//             }
//         }

//         //dynamic maincategs & subcategs
//         function createCateg(arr) {
//             let subCategs = "";
//             arr.map(function (i) {
//                 subCategs += `<div class="subCateg" data-subcateg="${i.gsx$subcategory.$t}">${i.gsx$subcategory.$t}</div>`;
//             });
//             return subCategs;
//         }

//         //fixed maincategs & dynamic subcategs
//         function createSubCategs(arr) {
//             arr.map(function (i) {
//                 let x = `<span class="wpSubCat" data-subcateg="${i.gsx$subcategory.$t}">${i.gsx$subcategoryname.$t}</span>`;
//                 $('.wpProductSubCategory[data-maincat="' + i.gsx$maincategory.$t + '"]').append(x)
//             });
//         }

//         //Remove Array Duuplicates
//         function removeDuplicates(array, key) {
//             return array.reduce(function (arr, item) {
//                 const removed = arr.filter(function (i) {
//                     return i[key] !== item[key];
//                 });
//                 return [...removed, item];
//             }, []);
//         };
//     }
// });


//MAIN PROCESS

    //Get Raw GSX Data
    const option = {
        url:'https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/default/public/values?alt=json',
        method:'GET'
    };

    try{
        let gsxData = getGSXData(option);
        gsxData.then(function(data){
            //Construct Object Data
            console.log(constructData(data));
        });
        //refineGSXData(rawData);
    }catch(e){
        console.log(e);
    }

    //Line 3001
    //Factory Function for GSX Data
    async function getGSXData(option){
        try{
            const result = await $.ajax(option);
            return result.feed.entry;
        }catch(error){
            throw new Error('getGSXData function Failed');
        }
    }

    //Construct Data from GSX Data
    function constructData(data){
        const constructedData=[];
        data.map(function(i){
            constructedData.push({
                'Item_Number': i.gsx$itemnumber.$t,
                'Product_Name': i.gsx$productname.$t
            });
        });
        return constructedData;
    }










$('.wpSubCat').on('click', function () {
    $('.wpSubCat').removeClass('activeCat');
    $(this).addClass('activeCat');
});

$(".wpSubCat").on({
    mouseenter: function () {
        $(this).addClass('hoverCat');
    },
    mouseleave: function () {
        $(this).removeClass('hoverCat');
    }
});


