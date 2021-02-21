
function Cart() {
    // localStorage key
    this.key = 'example-cart';
    // 購物車的品項清單資料
    this.data = [];
    // 初始化購物車
    this.initCart = function () {
        // 如果localstorage內有資料
        const localStorageString = localStorage.getItem(this.key);

        if (localStorageString) {
            this.data = JSON.parse(localStorageString);
        }

        this.render();
    }
    // 傳入商品id與數量並新增商品至購物車
    this.addItem = function (pid, amount) {
        // 透過pid尋找回產品的詳情資料
        const product = products.find(e => e.id === pid);

        // const pro = products.find(function(p){
        //     return p.id === pid;
        // }); 等於上一行
        console.log("[產品詳情]", product);

        //透過產品資料建立購物車品項
        const item = {
            title: product.title,
            price: product.price,
            pid: pid,
            amount: amount,
            //取得當下時間戳記
            createdAt: new Date().getTime()
        };
        console.log("新品項", item);

        //把購物車品項新增至購物車清單內
        this.data.push(item);
        // 渲染畫面
        this.render();
    }
    // 至購物車刪除於購物車內指定索引商品
    this.deleteItem = function (i) {
        this.data.splice(i, 1);
        this.render();
    }
    // 清空購物車
    this.emptyCart = function () {
        this.data = [];
        this.render();
    }
    // 更新資料到localStorage
    this.updateDataToStorage = function () {
        // 取得data並字串化
        const dataString = JSON.stringify(this.data);
        // 存入localstorage 
        localStorage.setItem(this.key, dataString);
    }
    // 渲染購物車
    this.render = function () {
        // 更新購物車資料
        this.updateDataToStorage();
        // 顯示購物車內商品個數
        $("#cartNavLink").html(`購物車<span class="badge badge-warning">${this.data.length}</span>`);
        //顯示購物車資料的地方
        const $tbody = $("#cartTableBody");
        // 清空tbody裡的內容
        $tbody.empty();

        //  總價
        let cartValue = 0;

        //把購物車品項逐一取出
        this.data.forEach(function (item,idx) {
            const itemValue = item.price * item.amount;
            cartValue += itemValue;

            //建立一個table row 並將table row 放入 $tbody內
            const tr = `
            <tr>
                    <td>
                        <button data-index="${idx}" class="btn btn-danger btn-sm removeBtn"> &times; </button>
                        ${item.title}
                    </th>
                    <td class="text-right">${item.price}</th>
                    <td class="text-right">${item.amount}</th>
                    <td class="text-right">$${itemValue}</th>
            </tr>} `;

            $tbody.append(tr);
        });

        // 將總價顯示在表格下方
        const $tfoot = $("#cartTableFoot");
        $tfoot.empty();
        $tfoot.append(`<tr>
            <td>總價</td>
            <td colspan="3" class="text-right">$${cartValue}</td>
        </tr>`);
    }
}

const cart = new Cart();
cart.initCart();

// 綁定加入商品至購物車事件
$("#productRow form").submit(function (e) {
    e.preventDefault();
    // jquery 中使用關鍵字this可回傳目前函數相關的物件
    console.log("目前回傳的表單", this);
    const pid = $(this).attr("data-product-id");
    let amount = parseInt($(`#amountInput${pid}`).val());
    console.log("[pid]", pid);
    console.log("[amount]", amount);
    // 讓購物車新增品項
    cart.addItem(pid, amount);

});

// 綁定清空按鈕點擊事件
$("#clearCartBtn").click(function(){
    cart.emptyCart();
});

// 綁定.removeBtn
$("#cartTableBody").delegate('.removeBtn','click', function(){
    let idx = parseInt($(this).attr('data-index'));
    cart.deleteItem(idx);
});