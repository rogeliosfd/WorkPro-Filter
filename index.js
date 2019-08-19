//MAIN PROCESS
let defaultSubCateg = 'FOLDUK';
let defaultMainCateg = 'Cutting Tools';

//Get Raw GSX Data
const option = {
    url: 'https://spreadsheets.google.com/feeds/list/1NHLMWWftwLNjYQMgxvc2sTKc6EEH4OWfx8UGemser6s/default/public/values?alt=json',
    method: 'GET'
};

try {
    let gsxData = getGSXData(option);
    gsxData.then(function (data) {
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
        let urlSubCateg = getParameterByName('prodSubcateg');
        let urlMainCateg = getParameterByName('prodMaincateg');
        let urlCateg = getParameterByName('prodcateg');
        if(urlSubCateg == 'prodSubcateg'){
            let subCat = getSubCateg(consObject, urlSubCateg);
            createBreadcrumbs(consObject, subCat[0].main_Category) //Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(subCat[0].main_Category);
            $('.wpProductShowcaseSubCat').text('');
            removeDuplicates(subCat,"sub_Category").map(function(i) {
                let output =`<div class="wpProductsContainer" data-subcateg="${i.sub_Category}">
                    <div class="wpProductShowcaseSubCat" ><span>${i.sub_CategoryName}</span></div></div>` ;
                $('.wpProdContWrap').append(output);
                return i;
            });            
            $('.wpProductsContainer').each(function(){
                let thisSubCat = $(this).attr("data-subcateg");                
                subCat.forEach(i=>{    
                    if(i.sub_Category == thisSubCat){
                        $('.wpProductsContainer[data-subcateg="' + thisSubCat + '"]').append(createProduct(i));
                    }
                });
            });    
        }
        if(urlMainCateg == 'prodMaincateg'){
            $('.wpProdContWrap').html("");
            let mainCategory = urlMainCateg;
            $('.wpProductCatTitle').removeClass('activeCat');
            $(this).addClass('activeCat');
            let subCat = getSubCateg(consObject, mainCategory);
            createBreadcrumbs(consObject, subCat[0].main_Category); //Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(subCat[0].main_Category);
            $('.wpProductShowcaseSubCat').text('');
            $('.wpProductsContainer').hide().empty();
            removeDuplicates(subCat,"sub_Category").map(function(i) {
                let output =`<div class="wpProductsContainer" data-subcateg="${i.sub_Category}">
                    <div class="wpProductShowcaseSubCat" ><span>${i.sub_CategoryName}</span></div></div>` ;
                $('.wpProdContWrap').append(output);
                return i;
            });
            
            $('.wpProductsContainer').each(function(){
                let thisSubCat = $(this).attr("data-subcateg");                
                subCat.forEach(i=>{    
                    if(i.sub_Category == thisSubCat){
                        $('.wpProductsContainer[data-subcateg="' + thisSubCat + '"]').append(createProduct(i));
                    }
                });
            });            

            if ($('.wpProductSubCategory[data-maincat="' + mainCategory + '"]').is(':hidden')) {
                $('.wpProductSubCategory').slideUp();
                $('.wpProductSubCategory[data-maincat="' + mainCategory + '"]').slideToggle();
            } else {
                $('.wpProductSubCategory').slideUp();
            }
        }
        if (urlMainCateg != null || urlMainCateg != undefined || urlSubCateg != null || urlSubCateg != undefined) {
            let subCat = getSubCateg(consObject, defaultMainCateg);
            createBreadcrumbs(consObject, subCat[0].main_Category) //Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(subCat[0].main_Category);
            $('.wpProductShowcaseSubCat').text('');
            removeDuplicates(subCat,"sub_Category").map(function(i) {
                let output =`<div class="wpProductsContainer" data-subcateg="${i.sub_Category}">
                    <div class="wpProductShowcaseSubCat" ><span>${i.sub_CategoryName}</span></div></div>` ;
                $('.wpProdContWrap').append(output);
                return i;
            });            
            $('.wpProductsContainer').each(function(){
                let thisSubCat = $(this).attr("data-subcateg");                
                subCat.forEach(i=>{    
                    if(i.sub_Category == thisSubCat){
                        $('.wpProductsContainer[data-subcateg="' + thisSubCat + '"]').append(createProduct(i));
                    }
                });
            }); 
        } else {          
            let subCat = getSubCateg(consObject, defaultMainCateg);
            createBreadcrumbs(consObject, subCat[0].main_Category) //Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(subCat[0].main_Category);
            $('.wpProductShowcaseSubCat').text('');
            removeDuplicates(subCat,"sub_Category").map(function(i) {
                let output =`<div class="wpProductsContainer" data-subcateg="${i.sub_Category}">
                    <div class="wpProductShowcaseSubCat" ><span>${i.sub_CategoryName}</span></div></div>` ;
                $('.wpProdContWrap').append(output);
                return i;
            });            
            $('.wpProductsContainer').each(function(){
                let thisSubCat = $(this).attr("data-subcateg");                
                subCat.forEach(i=>{    
                    if(i.sub_Category == thisSubCat){
                        $('.wpProductsContainer[data-subcateg="' + thisSubCat + '"]').append(createProduct(i));
                    }
                });
            });              
        }

        //ONCLICK FILTER THROUGH SUBCATEG
        $('.wpProductFilter').on('click', '.wpSubCat', function () {
            let selectedCateg = $(this).data('categ');
            $('.wpProductsContainer[data-subcateg="'+selectedCateg+'"]').show();
            $('.wpProductsContainer:not([data-subcateg="'+selectedCateg+'"])').css({'margin-top':'0'});
            filterProducts(consObject, selectedCateg);
        });

        //ONCLICK FILTER THROUGH BREADCRUMB
        $('.wpProductShowcaseBreadcrumb').on('click', '.subCategBreadCrumbs', function () {
            let selectedCateg = $(this).data('categ');
            $('.wpProductsContainer[data-subcateg="'+selectedCateg+'"]').show();
            $('.wpProductsContainer:not([data-subcateg="'+selectedCateg+'"])').css({'margin-top':'0'});
            filterProducts(consObject, selectedCateg);
        });

        $('.wpProductFilter').on('click', '.wpProductCatTitle', function () {
            $('.wpProdContWrap').html("");
            let mainCategory = $(this).data('maincat');
            $('.wpProductCatTitle').removeClass('activeCat');
            $(this).addClass('activeCat');
            let subCat = getSubCateg(consObject, mainCategory);
            createBreadcrumbs(consObject, subCat[0].main_Category); //Create Breadcrumbs
            $('.wpProductShowcaseMainCat').text(subCat[0].main_Category);
            $('.wpProductShowcaseSubCat').text('');
            $('.wpProductsContainer').hide().empty();
            removeDuplicates(subCat,"sub_Category").map(function(i) {
                let output =`<div class="wpProductsContainer" data-subcateg="${i.sub_Category}">
                    <div class="wpProductShowcaseSubCat" ><span>${i.sub_CategoryName}</span></div></div>` ;
                $('.wpProdContWrap').append(output);
                return i;
            });
            
            $('.wpProductsContainer').each(function(){
                let thisSubCat = $(this).attr("data-subcateg");                
                subCat.forEach(i=>{    
                    if(i.sub_Category == thisSubCat){
                        $('.wpProductsContainer[data-subcateg="' + thisSubCat + '"]').append(createProduct(i));
                    }
                });
            });            

            if ($('.wpProductSubCategory[data-maincat="' + mainCategory + '"]').is(':hidden')) {
                $('.wpProductSubCategory').slideUp();
                $('.wpProductSubCategory[data-maincat="' + mainCategory + '"]').slideToggle();
            } else {
                $('.wpProductSubCategory').slideUp();
            }
        });

    });    

    $(window).scroll(function () {
        let winPos = $(window).scrollTop(),
            prodShowcase = $('.wpProductShowcase').outerHeight();
        winPos >= prodShowcase - 450 ? $('.wpProductFilter').css({
            'position': 'relative',
            'margin-bottom': '0',
            'margin-top': 'auto',
            'width': '28%'
        }) : $('.wpProductFilter').css({
            'position': '',
            'margin-bottom': '',
            'margin-top': '',
            'width': ''
        });
    });

} catch (e) {
    console.log(e);
}

//Line 3001
//Factory Function for GSX Data
async function getGSXData(option) {
    try {
        const result = await $.ajax(option);
        return result.feed.entry;
    } catch (error) {
        throw new Error('getGSXData function Failed');
    }
}

//Create Products
function createProduct(prod) {
    let item = `<div class="wpProductWrap" data-subcat="${prod.sub_Category}">
                    <div class="innerWpProduct">
                        <div class="wpProductImgWrap">
                            ${prod.new_Product == 'Yes' ? '<img class="end-pro-end" src="http://www.workprotools.com/static/web/img/img-56.png?v=v1 " alt="">': ""}
                            <img src="${prod.image}" alt="">
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
function getProds(arr, categ) {
    let filteredProd = arr.filter(function (obj) {
        return obj.sub_Category === categ;
    });
    return filteredProd;
}

function getSubCateg(arr, maincateg){
    let filteredCat = arr.filter(function(obj){
        return obj.main_Category === maincateg;
    });
    return filteredCat;
}

//Filter Products based on SubCategories
function filterProducts(consObject, selectedCateg) {    
    $('.wpProductsContainer').html('');
    let fProds = getProds(consObject, selectedCateg); //FILTERED PRODUCTS BASED ON BUTTON CATEG
    createBreadcrumbs(consObject, fProds[0].main_Category) //Create Breadcrumbs
    $('.wpProductShowcaseMainCat').text(fProds[0].main_Category);
    $('.wpProductShowcaseSubCat').text(fProds[0].sub_CategoryName);
    $('.wpProductsContainer').hide().empty();
    fProds.map(function (i) {
        $('.wpProductsContainer[data-subcateg='+selectedCateg+']').append(createProduct(i));
    });
    $('.wpProductsContainer').fadeIn();
}

//Group Products into Main Products
function groupInto(consObject) {
    let result = consObject.reduce(function (h, obj) {
        h[obj.main_Category] = (h[obj.main_Category] || []).concat(obj);
        return h;
    }, {});
    return result;
}

//Crete and Append Subcategories
function createSubCategs(data) {
    let result = data.reduce(function (memo, e1) {
        var matches = memo.filter(function (e2) {
            return e1.sub_Category == e2.sub_Category
        });
        if (matches.length == 0)
            memo.push(e1)
        return memo;
    }, []);

    result.map(function (i) {
        let subCateg = `<div class="wpSubCat" data-categ="${i.sub_Category}">${i.sub_CategoryName}</div>`;
        $('.wpProductSubCategory[data-maincat="' + i.main_Category + '"]').append(subCateg);
    });

}

//Create Breadcrumbs
function createBreadcrumbs(arr, mainCateg) {
    let filteredProd = arr.filter(function (obj) {
        return obj.main_Category === mainCateg;
    });

    let filterdSubCateg = filteredProd.reduce(function (memo, e1) {
        var matches = memo.filter(function (e2) {
            return e1.sub_Category == e2.sub_Category
        })
        if (matches.length == 0)
            memo.push(e1)
        return memo;
    }, []);


    let output = '';
    filterdSubCateg.map(a => {
        output += `<span class="subCategBreadCrumbs" data-categ="${a.sub_Category}">${a.sub_CategoryName}</span> / `
    });
    $('.wpProductShowcaseBreadcrumb').html(output.slice(0, -2));
}

//Construct Data from GSX Data
function constructData(data) {
    const constructedData = [];
    data.map(function (i) {
        constructedData.push({
            'item_Number': i.gsx$itemnumber.$t,
            'product_Name': i.gsx$productname.$t,
            'new_Product': i.gsx$newproduct.$t,
            'main_Category': i.gsx$maincategory.$t,
            'sub_Category': i.gsx$subcategory.$t,
            'sub_CategoryName': i.gsx$subcategoryname.$t,
            'rating': i.gsx$rating.$t,
            'link': i.gsx$link.$t,
            'image': i.gsx$image.$t
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

//Remove Duplicate Objects
function removeDuplicates(array, key){
    return array.reduce(function(arr, item) {
       const removed = arr.filter(function(i){
           return i[key] !== item[key];
       });
       return [...removed, item];
   },[]);
};

// let result = gsxData.reduce(function (h, obj) {
//     h[obj.gsx$maincategory.$t] = (h[obj.gsx$maincategory.$t] || []).concat(obj);
//     return h;
// }, {});