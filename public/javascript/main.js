function addToCart(proId){
    $.ajax({
        url:'/api/cart/add-to-cart/'+proId,
        method:'post',
        
        success:(response)=>{
            
            if(response.status){
                
                let count=$('#cart-count').text()
                count=parseInt(count)+1
                $("#cart-count").html(count)
                
            } else if(response.quantity){
                
                alert('Same ITem Quantity Increased +1')
                
            }else if(response.login){
                console.log('No cart' );
                window.location = "/api/auth/login";
            }
            
                                     
        }
    })
}