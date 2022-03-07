import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClsOrder } from 'src/app/model/cls-order';
import { ClsProductLine } from 'src/app/model/cls-product-line';
import { ClsSupplier } from 'src/app/model/cls-supplier';
import { SupplierService } from "src/app/services/supplierServices/supplier.service";
import { ProductService } from "src/app/services/productServices/product.service";
import { OrderService } from 'src/app/services/orderServices/order.service';
import { ClsOrderLine } from 'src/app/model/cls-order-line';
import { OrderLinesService } from 'src/app/services/orderLinesservices/order-lines.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmingDialogComponent } from '../confirming-dialog/confirming-dialog.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper-create-order-complete',
  templateUrl: './stepper-create-order-complete.component.html',
  styleUrls: ['./stepper-create-order-complete.component.scss']
})
export class StepperCreateOrderCompleteComponent implements OnInit {
  
  arrayDeSuppliers: Array<ClsSupplier> = [];
  idsupplierSeleccionado:number;
  productList:Array<ClsProductLine>=[];
  auxList:Array<ClsProductLine>=[];
  arrayCart : Array<ClsProductLine>=[];
  auxCarList:Array<ClsProductLine>=[];
  orderId:number;
  limitOrderDate:Date;
  notes:string;
  total:number = 0;
  @ViewChild('stepper') private myStepper: MatStepper;
  
  constructor(private router:Router,private dialogRef: MatDialogRef<OrderListComponent>,public SupplierService: SupplierService, public ProductService: ProductService, private OrderService : OrderService, private OrderLinesService: OrderLinesService,private dialog:MatDialog) {}
  
  ngOnInit(): void {
    this.SupplierService.getAllSuppliers().subscribe(data => this.arrayDeSuppliers = data);
    this.OrderService.getLastOrderId().subscribe(data => this.orderId = data+1);
  }
  
  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Categoria', 'Precio', 'Cantidad', 'Anhadir'];
  displayedColumnsShoppingCart: string[] = ['Nombre', 'Cantidad', 'Borrar'];
  
  /**
   * Header: onChangeObj(selectedid:number)
   * 
   * Description: Este metodo se encarga de actualizar la tabla de productos
   * en base al id del proveedor.
   * 
   * Precondition: Ninguna
   * Postcondition: Actualiza la tabla
   * @param selectedid number
   */
  onChangeObj(selectedid:number) {    
    this.productList =[]
    this.auxList = []
    this.arrayCart = []
    this.auxCarList = []
    
    this.idsupplierSeleccionado = selectedid;
    try{
      this.ProductService.getProductBySupplierId(selectedid).subscribe(data =>  {
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
          this.auxList.push(prodTmp);
        });   
        this.productList = this.auxList; 
      }); 
    }catch(Exception){
      this.router.navigateByUrl('error');
    }
  }
  /**
   * Header: aniadirProducto(productoSeleccionado: ClsProductLine)
   * 
   * Description: Este metodo se encarga de añadir un producto al pedido
   * 
   * Precondition: Ninguna
   * Postcondition: Añade la linea de pedido
   * @param productoSeleccionado ClsProductLine
   */
  aniadirProducto(productoSeleccionado: ClsProductLine){
    let unico=true;
    if (!isNaN(productoSeleccionado.amount) && productoSeleccionado.amount > 0 ){
      //todo verificar numero
      for (var i = 0, len = this.arrayCart.length; i < len; i++) {     
        let producto =this.arrayCart[i];
        if (producto.orderId==productoSeleccionado.orderId){
          let cantidadFinal=Number (producto.amount)+Number(productoSeleccionado.amount);
          producto.amount=cantidadFinal;
          unico=false;     
          break;     
        }
      }       
      if(unico)
      this.arrayCart.push(JSON.parse(JSON.stringify(productoSeleccionado)));
      productoSeleccionado.amount=0;
    }
    else
    alert("Cantidad erronea");
  }
  /**
   * Header: enviarPedido()
   * 
   * Description: Este metodo se encarga de enviar el pedido a la api, creandolo.
   * 
   * Precondition: Ninguna
   * Postcondition: Crea el pedido y lo guarda en la api
   */
  enviarPedido(){      
    if(this.arrayCart==null||this.arrayCart.length==0){
      alert("El carro esta vacio");
    }else{        
      const pedido: ClsOrder={
        orderId: 0,
        total: this.total,
        orderDate: new Date(),
        limitOrderDate: this.limitOrderDate,
        notes:this.notes,
        supplierId: this.idsupplierSeleccionado
      }
             
        if (pedido.limitOrderDate > new Date()) {          
          try{
            this.OrderService.insertOrder(pedido).subscribe(patata => {
              this.OrderService.getLastOrderId().subscribe(numero => {
                this.arrayCart.forEach(linea=>{
                  let  lineaTMP : ClsOrderLine={
                    id: 0 ,
                    quantity: linea.amount,
                    currentUnitPrice: linea.unitPrice,
                    subtotal:Number (linea.amount)*Number(linea.unitPrice),
                    orderId: numero,
                    productId: linea.orderId          
                  };
                  this.OrderLinesService.insertOrderLine(lineaTMP).subscribe(lines => console.log(lines));
                });
              });
            }); 
          }catch(error){
            this.router.navigateByUrl('error');
          }      
        }   
        else {
          alert("fecha no puede ser anterior a la de hoy")
          this.myStepper.previous();
        } 
    }
  }
  /**
   * Header: eliminarProducto(productoSeleccionado: ClsOrderLineConNombre)
   * 
   * Description: Este metodo se encarga de eliminar un producto de un pedido.
   * 
   * Precondition: Ninguna
   * Postcondition: Elimina el producto del pedido
   * @param productoSeleccionado
   */
  eliminarProducto(productoSeleccionado: ClsProductLine){   
    this.arrayCart = this.arrayCart.filter(item => item !== productoSeleccionado);
    this.auxCarList = this.auxCarList.filter(item => item !== productoSeleccionado);
  }
  /**
   * Header: calcularTotal():number
   * 
   * Description: Este metodo se encarga de calcular el total del pedido.
   * 
   * Precondition: Ninguna
   * Postcondition: Calcula el total del pedido
   * @returns total: number
   */
  calcularTotal(){
    this.total = 0;
    this.arrayCart.forEach(prod => 
      this.total = this.total + Number(prod.amount) * Number(prod.unitPrice)
      );
      
    }
    /**
   * Header:close()
   * 
   * Description: Este metodo se encargaa de cerra un dialog
   * 
   * Preconditions: Ninguna
   * Postconditions: Cierra el dialog
   */
    close(){
      this.dialogRef.close();
    }
  }
  
  
  
  
  