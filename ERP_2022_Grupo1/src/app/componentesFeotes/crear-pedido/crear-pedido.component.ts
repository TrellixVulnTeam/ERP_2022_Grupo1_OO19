import { Component, OnInit } from '@angular/core';

import { ClsSupplier } from 'src/app/model/cls-supplier';
import { ClsProductLine } from 'src/app/model/cls-product-line'


import { SupplierService } from "src/app/services/supplierServices/supplier.service";
import { ProductService } from "src/app/services/productServices/product.service";
import { OrderService } from 'src/app/services/orderServices/order.service';
import { OrderLinesService } from 'src/app/services/orderLinesservices/order-lines.service';
import { ClsOrder } from 'src/app/model/cls-order';
import { ClsOrderLine } from 'src/app/model/cls-order-line';


@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit {
  
  arrayDeSuppliers: Array<ClsSupplier> = [];
  
  arrayProduct : Array<ClsProductLine>=[];
  
  arrayCart : Array<ClsProductLine>=[];
  
  supplierSeleccionado = this.arrayDeSuppliers[1];
  
  constructor(private SupplierService: SupplierService, private ProductService: ProductService, private OrderService : OrderService, private OrderLinesService: OrderLinesService) { }
  
  
  ngOnInit(): void {    
    this.SupplierService.getAllSuppliers().subscribe(data => this.arrayDeSuppliers = data);    
  }
  
  onChangeObj(selected:ClsSupplier) {
    //console.log(selected);    
    this.arrayCart=[];
    this.arrayProduct=[];
    this.supplierSeleccionado=selected;
    this.ProductService.getProductBySupplierId(selected.idSupplier).subscribe(data => {
      data.forEach(prod => {
        let  prodTmp : ClsProductLine={
          orderId: prod.orderId,
          name:prod.name,
          description: prod.description,
          unitPrice: prod.unitPrice,
          category:prod.category,
          amount:0,
          status:false
        };
        this.arrayProduct.push(prodTmp)      
      });     
    }); 
  }
  
  aniadirProducto(productoSeleccionado: ClsProductLine){
    let unico=true;
    if (productoSeleccionado.amount!=0){
      //todo verificar numero
      for (var i = 0, len = this.arrayCart.length; i < len; i++) {     
        let producto =this.arrayCart[i];
        if (producto.orderId==productoSeleccionado.orderId){
          let cantidadFinal=Number (producto.amount)+Number(productoSeleccionado.amount);
          producto.amount=cantidadFinal;
          unico=false     
          break;     
        }
      }       
      if(unico)
      this.arrayCart.push(JSON.parse(JSON.stringify(productoSeleccionado)));
      productoSeleccionado.amount=0;
    }
    else
    alert("Introduzca una cantidad a solicitar primero")
  }
  
  eliminarProducto(productoSeleccionado: ClsProductLine){   
    this.arrayCart = this.arrayCart.filter(item => item !== productoSeleccionado);
  }     
  
  enviarPedido(){
    if(this.arrayCart==null||this.arrayCart.length==0){
      alert("el carro esta vacio");
      console.log(this.arrayCart.length);
    }else{    
      
      const pedido: ClsOrder={
        orderId: 0,
        total: 1,
        orderDate: new Date(),
        limitOrderDate: new Date(),
        notes:"cosa",
        supplierId: this.supplierSeleccionado.idSupplier
      }
      console.log(pedido);
      this.OrderService.insertOrder(pedido).subscribe; 
      
      //get last id
      
      this.arrayCart.forEach(linea=>{
        let  lineaTMP : ClsOrderLine={
          id: 0 ,
          quantity: linea.amount,
          currentUnitPrice: linea.unitPrice,
          subtotal:Number (linea.amount)*Number(linea.unitPrice),
          //todo get last id
          orderId:1,
          productId: linea.orderId          
        };
        console.log(lineaTMP);
        this.OrderLinesService.insertOrderLine(lineaTMP).subscribe;
      });
      
      
    }
    
  }
  /*
  orderId: number;
  total: number;
  orderDate: Date;
  limitOrderDate: Date;
  notes: String;
  supplierId: number;
  */
}


