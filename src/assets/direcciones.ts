export const ip:string = "http://localhost:8080";



export let empresaLugar = {empre:""};

export let direcciones:any = {
    usuarios: function(){
        return `${ip}/catalogos/${empresaLugar.empre}/usuarios`;
    },
    sucursales:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/sucursales`;
    },
    categorias:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/categorias`;
    },
    productos:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/productos`;
    },
    tickets:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/tickets`;
    },
    combos:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/combos`;
    },
    inventarios:function(){
       return  `${ip}/catalogos/${empresaLugar.empre}/inventarios`
    },
    ajustes:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/inventariosajustes`;
    },
    mesas:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/mesas`;
    },        
    roles:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/roles`;
    },
    reportes:function(){
        return `${ip}/reportes/${empresaLugar.empre}`;
    },
    cortecaja:function(){
        return `${ip}/cortecaja/${empresaLugar.empre}`;
    },
    promociones:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/promociones`;
    },
    ordenes:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/ordenes`;
    },
    estadisticas:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/estadistica`;
    },

    payment:function(){
        return `${ip}/payment/${empresaLugar.empre}/payment`;
    },

    key:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/key`;
    },
    menudesplegable:function(){
        return `${ip}/catalogos/${empresaLugar.empre}/menudesplegable`;
    },
    empresas:ip+"/administracion/empresas",
    administracion:ip+"/administracion",
    configuracion:function(){
        return `${ip}/api/${empresaLugar.empre}/configuracion`;
    },
};
