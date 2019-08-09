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
let defaultSubCateg = 'FOLDUK';

//Get Raw GSX Data
const option = {
    url:'https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/default/public/values?alt=json',
    method:'GET'
};

try{
    let gsxData = getGSXData(option);
    gsxData.then(function(data){
        //Construct Object Data
        let consObject = constructData(data);
        propList = constructData(data);

        //Group Products into Main Products
        let groupProd = groupInto(consObject);

        for (var key in groupProd) {
            if (groupProd.hasOwnProperty(key)) {
                //Create Subcategs
                createSubCategs(groupProd[key])
            }
        }

        //POPULATE PRODUCTS DEPENDING IF THERE IS URL PARAM OR NONE
        let urlCateg = getParameterByName('prodcateg');
        if(urlCateg != null || urlCateg != undefined){
            let fProds = getProds(consObject,urlCateg);//FILTERED PRODUCTS BASED ON URL PARAMS
            createBreadcrumbs(consObject,fProds[0].main_Category)//Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(fProds[0].main_Category);
            $('.wpProductShowcaseSubCat').text(fProds[0].sub_CategoryName);

            fProds.map(function(i){
                $('.wpProductsContainer').append(createProduct(i));
            });

            //Add Active Categ
            $('.wpSubCat[data-categ="'+urlCateg+'"]').addClass('activeCat');
        }else{
            let fProds = getProds(consObject,defaultSubCateg);//FILTERED PRODUCTS
            createBreadcrumbs(consObject,fProds[0].main_Category)//Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(fProds[0].main_Category);
            $('.wpProductShowcaseSubCat').text(fProds[0].sub_CategoryName);

            fProds.map(function(i){
                $('.wpProductsContainer').append(createProduct(i));
            });

            //Add Active Categ
            $('.wpSubCat[data-categ="'+defaultSubCateg+'"]').addClass('activeCat');
        }

        //ONCLICK FILTER
        $('.wpProductFilter').on('click','.wpSubCat', function() {
            $(this).addClass('activeCat');
            $('.wpSubCat').not(this).removeClass('activeCat');

            let selectedCateg = $(this).data('categ');
            let fProds = getProds(consObject,selectedCateg);//FILTERED PRODUCTS BASED ON BUTTON CATEG
            createBreadcrumbs(consObject,fProds[0].main_Category)//Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(fProds[0].main_Category);
            $('.wpProductShowcaseSubCat').text(fProds[0].sub_CategoryName);
            $('.wpProductsContainer').hide().empty();
            fProds.map(function(i){
                $('.wpProductsContainer').append(createProduct(i));
            });
            $('.wpProductsContainer').fadeIn();
        });
    });

    
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

//Create Products
function createProduct(prod){
    let img = 'http://www.workprotools.com/upload/2018/08/17/15344728359017ucbvl.jpg'
    let item = `<div class="wpProductWrap">
                    <div class="innerWpProduct">
                        <div class="wpProductImgWrap">
                            ${prod.new_Product == 'Yes' ? '<img class="end-pro-end" src="http://www.workprotools.com/static/web/img/img-56.png?v=v1 " alt="">': ""}
                            <img src="${img}" alt="">
                        </div>
                        <div class="wpProductInfoWrap">
                            <div class="wpProductName">${prod.product_Name}</div>
                            <div class="wpProductItemNum">ITEM# : ${prod.item_Number}</div>
                            <div class="wpProductReviews"></div>
                        </div>
                    </div>
                </div>`
    return item;
}

//Filter Array based on Category
function getProds(arr,categ){
    let filteredProd = arr.filter(function(obj) {
        return obj.sub_Category === categ;
    });
    return filteredProd
}

//Group Products into Main Products
function groupInto(consObject){
    let result = consObject.reduce(function (h, obj) {
        h[obj.main_Category] = (h[obj.main_Category] || []).concat(obj);
        return h;
    }, {});
    return result
}

//Crete and Append Subcategories
function createSubCategs(data){
    let result = data.reduce(function(memo, e1){
        var matches = memo.filter(function(e2){
            return e1.sub_Category == e2.sub_Category
        })
        if (matches.length == 0)
            memo.push(e1)
            return memo;
    }, [])
    

    result.map(function(i){
        let subCateg = `<div class="wpSubCat" data-categ="${i.sub_Category}">${i.sub_CategoryName}</div>`;
        $('.wpProductSubCategory[data-maincat="'+i.main_Category+'"]').append(subCateg);
    });

}

//Create Breadcrumbs
function createBreadcrumbs(arr,mainCateg){
    let filteredProd = arr.filter(function(obj) {
        return obj.main_Category === mainCateg;
    });

    let filterdSubCateg = filteredProd.reduce(function(memo, e1){
        var matches = memo.filter(function(e2){
            return e1.sub_Category == e2.sub_Category
        })
        if (matches.length == 0)
            memo.push(e1)
            return memo;
    }, [])

    let bredCrumbs = filterdSubCateg.map(a => a.sub_CategoryName);
    $('.wpProductShowcaseBreadcrumb').text(bredCrumbs.join(' / '));
}

//Construct Data from GSX Data
function constructData(data){
    const constructedData=[];
    data.map(function(i){
        constructedData.push({
            'item_Number': i.gsx$itemnumber.$t,
            'product_Name': i.gsx$productname.$t,
            'new_Product': i.gsx$newproduct.$t,
            'main_Category': i.gsx$maincategory.$t,
            'sub_Category': i.gsx$subcategory.$t,
            'sub_CategoryName': i.gsx$subcategoryname.$t,
            'rating': i.gsx$rating.$t,
            'link': i.gsx$link.$t
        });
    });
    return constructedData;
}

//Get URL parameters value
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


// let result = gsxData.reduce(function (h, obj) {
//     h[obj.gsx$maincategory.$t] = (h[obj.gsx$maincategory.$t] || []).concat(obj);
//     return h;
// }, {});
