$.ajax({
    url:"https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/default/public/values?alt=json",
    method:"GET",
    crossdomain:true,
    success:function(data){
        var gsxData = data.feed.entry;
        //console.log(p);

        let result = gsxData.reduce(function(h, obj) {
            h[obj.gsx$maincategory.$t] = (h[obj.gsx$maincategory.$t] || []).concat(obj);
            return h;
        }, {});
        
        console.log(result);

        for (var key in result) {
            if (result.hasOwnProperty(key)) {

                //dynamic maincategs & subcategs
                // let content = `<div class="categWrap">
                // <div class="mainCateg">${key}</div>
                // <div class="subCategWrapper">
                // ${createCateg(result[key])}
                // </div>
                // <div>`;

                // $('.mainCategWrapper').append(content);

                //fixed maincategs & dynamic subcategs
                createSubCategs(result[key])
            }
        }

        //dynamic maincategs & subcategs
        function createCateg(arr){
            let subCategs = "";
            arr.map(function(i){
                subCategs += `<div class="subCateg" data-subcateg="${i.gsx$subcategory.$t}">${i.gsx$subcategory.$t}</div>`;
            });
            return subCategs;
        }

        //fixed maincategs & dynamic subcategs
        function createSubCategs(arr){
            arr.map(function(i){
                let x = `<span class="wpSubCat" data-subcateg="${i.gsx$subcategory.$t}">${i.gsx$subcategoryname.$t}</span>`;
                $('.wpProductSubCategory[data-maincat="'+i.gsx$maincategory.$t+'"]').append(x)
            });
        }
    }
});

// let list;

// async function GSXData() {
//     let rawData = await $.ajax({
//         url: "https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/od6/public/values?alt=json",
//         method: 'GET'
//     });
//     list = refinedGSX(rawData);
//     //appendList(list);
// }

// function refinedGSX(rawData) {
//     return rawData.feed.entry.map(function (i) {
//         return {
//             'Item_Number': i.gsx$itemnumber.$t,
//             'Product_Name': i.gsx$productname.$t,
//             'New_Product': i.gsx$newproduct.$t,
//             'Main_Category': i.gsx$maincategory.$t,
//             'Sub_Category': i.gsx$subcategory.$t,
//             'Rating': i.gsx$rating.$t,
//             'Link': i.gsx$link.$t
//         }; //PUSH TO THE EMPTY ARRAY        
//     }); // MAP FUNC
// };

$('.wpSubCat').on('click', function(){
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