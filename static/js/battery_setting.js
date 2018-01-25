$(function(){
  var battery_setting = {
    orgData: new Array(),
    onInit:function(){
      layui.use(['table','form'], function(){
        var table = layui.table,
        form = layui.form;
        $.proxy(battery_setting.loadServerData(),battery_setting);
        $.proxy(battery_setting.renderTable(battery_setting.orgData),battery_setting);
        
        form.on('submit(addRow)',function(){
          $.proxy(battery_setting.addRow(),battery_setting);
          $.proxy(battery_setting.renderTable(battery_setting.orgData),battery_setting);
          return false;
        });
        
        table.on('tool(setting_table)',function(obj){
          var data = obj.data;
          var layEvent = obj.event;
          var tr = obj.tr;
          
          if(layEvent == 'save'){
            var receiver = data.receiver;
            var temp_lower = data.temp_lower;
            var temp_upper = data.temp_upper;
            var voltage_lower = data.voltage_lower;
            var voltage_upper = data.voltage_upper;
            var receiver_sn = data.receiver_sn;
            if(receiver_sn!=""&&temp_lower!=""&&temp_upper!=""&&voltage_lower!=""&&voltage_upper!=""&&receiver!=""){
              url = '/save_battery_setting'+'?receiver='+receiver+'&receiver_sn='+receiver_sn+'&temp_lower='
                    +temp_lower+'&temp_upper='+temp_upper+'&voltage_lower='+voltage_lower+'&voltage_upper='+voltage_upper;
            $.get(url, function(data){
              battery_setting.orgData = data.data;
              //console.log(battery_setting.orgData);
              $.proxy(battery_setting.renderTable(battery_setting.orgData),battery_setting);
              });
              //$.proxy(battery_setting.loadServerData(),battery_setting);
              //$.proxy(battery_setting.renderTable(battery_setting.orgData),battery_setting);
              }
            else{
                layer.confirm('请填充数据',function(index){
                layer.close(index);
                obj.del();
                battery_setting.orgData.pop();
              });
            }
          }else if(layEvent == 'delete'){
            layer.confirm('将删除数据',function(index){
              obj.del();
              layer.close(index);
              var receiver = data.receiver;
              var receiver_sn = data.receiver_sn;
              if(receiver!=''&&receiver_sn!=''){
                url = '/delete_battery_setting'+'?receiver_sn='+receiver_sn;
                $.get(url, function(data){
                  battery_setting.orgData = data.data;
                  //console.log(battery_setting.orgData);
                  $.proxy(battery_setting.renderTable(battery_setting.orgData),battery_setting);
                  });
              }else{
                battery_setting.orgData.pop();
              }
            });
          }
        });  
      });
    },
    renderTable:function(data){
      var tableHeight=$(document).height()-260+'px';
      layui.use('table',function(){
        var table = layui.table;
        table.render({
          elem: '#batteryTable',
          height: tableHeight,
          data: data,
          page:false,
          cols: [[
          {type:'numbers'},
          {field: 'receiver_sn', title: '序列号',sort: true, edit: 'text',width:'25%'},
          {field: 'receiver', title: '接收器',sort: true, edit: 'text'},
          {field: 'voltage_upper', title: '电压上限(V)',sort: true, edit: 'text'},
          {field: 'voltage_lower', title: '电压下限(V)',sort:true, edit: 'text'},
          {field: 'temp_upper', title: '温度上限(℃)',sort: true, edit: 'text'},
          {field: 'temp_lower', title: '温度下限(℃)',sort: true, edit: 'text'},
          {field: 'btn', title: '操作',sort: false, toolbar:'#barDemo'},
          ]]
        });
      });
    },
    loadServerData:function(){
      var user_name = $("#user_name").text();
      battery_setting.orgData=[];
      $.ajax({
        url:'/get_battery_setting'+'?user_name='+user_name,
        type:'GET',
        datatype:'json',
        async:false,
        success:function(data){
          $.each(data.data,function(index,value){
            var eachValue = value;
            eachValue.btn = '#barDemo';
            battery_setting.orgData.push(eachValue);
          });
        }
      });
    },
    addRow:function(){
      var newLine = {
        "receiver_sn":"",
        "receiver":"",
        "voltage_upper":"",
        "voltage_lower":"",
        "temp_upper":"",
        "temp_lower":"",
        "btn": '#barDemo'
      };
      battery_setting.orgData.push(newLine);
    },
  }
  battery_setting.onInit();
});