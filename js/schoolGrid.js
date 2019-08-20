Ext.onReady(function () {

    const contextmenu=new Ext.menu.Menu({
        id:"myContextmenu",
        items:[
            {
                text:"上移行",
                handler:function () {
                    let checkItem=panel.getSelectionModel().getSelections()[0];
                    let insertIndex=store.indexOfId(checkItem.id);
                    if(insertIndex!==0){
                        panel.stopEditing();
                        store.remove(checkItem);
                        store.insert(insertIndex-1,checkItem);
                    }
                }
            },{
                text:"下移行",
                handler:function () {
                    let checkItem=panel.getSelectionModel().getSelections()[0];
                    let insertIndex=store.indexOfId(checkItem.id);
                    panel.stopEditing();
                    store.remove(checkItem);
                    store.insert(insertIndex+1,checkItem);
                }
            },{
                text:"上移行至头部",
                handler:function () {
                    let checkItem=panel.getSelectionModel().getSelections()[0];
                    panel.stopEditing();
                    store.remove(checkItem);
                    store.insert(0,checkItem);
                }
            },{
                text:"下移行至尾部",
                handler:function () {
                    let checkItem=panel.getSelectionModel().getSelections()[0];
                    panel.stopEditing();
                    store.remove(checkItem);
                    store.insert(store.totalLength-1,checkItem);
                }
            }
        ]
    });
    const sm=new Ext.grid.CheckboxSelectionModel();

    const sexData=[['male', 'male'], ['female', 'female']];
    const sexCombo = new Ext.form.ComboBox({
        store: new Ext.data.SimpleStore({
            fields: ['value', 'text'],
            data: sexData
        }),
        mode: 'local',
        emptyText: "请选择性别",
        triggerAction: 'all',
        valueField: "value",
        displayField: 'text',
    });

    const chooseAvatar=()=>{
        return '<img src="../img/aa.jpg" alt="aa"/>'
    };
    const cm=new Ext.grid.ColumnModel([
        sm,
        new Ext.grid.RowNumberer(),
        {header:"姓名",dataIndex:"name",sortable:true,editor:new Ext.grid.GridEditor(new Ext.form.TextField({allowBlank:false}))},
        {header:"教室",dataIndex:"class",sortable:true,editor:new Ext.grid.GridEditor(new Ext.form.TextField({allowBlank:false}))},
        {header:"性别",dataIndex:"sex",editor:new Ext.grid.GridEditor(sexCombo)},
        {header:"年龄",dataIndex:"age",editor:new Ext.grid.GridEditor(new Ext.form.NumberField({allowBlank:false}))},
        {header:"生日",dataIndex:"birthday",renderer:Ext.util.Format.dateRenderer('Y-m-d'),editor:new Ext.grid.GridEditor(new Ext.form.DateField({allowBlank:false}))},
        {header:"头像",dataIndex:"avatar",renderer:chooseAvatar }
    ]);

    const data=[
        ['name1','1','male','20','2019-08-20T01:23:45'],
        ['name2','1','female','22','2019-08-19T01:23:45'],
        ['name3','2','male','23','2019-08-18T01:23:45'],
        ['name4','2','female','24','2019-08-17T01:23:45'],
        ['name5','3','male','25','2019-08-16T01:23:45'],
        ['name6','3','female','27','2019-08-15T01:23:45']
    ];

    const store=new Ext.data.GroupingStore({
        groupField:"class",
        proxy:new Ext.data.PagingMemoryProxy(data),
        reader:new Ext.data.ArrayReader({},[
            {name:"name"},
            {name:"class"},
            {name:"sex"},
            {name:"age"},
            {name:"birthday",type:"date",dateFormat:"Y-m-dTH:i:s"},
            {name:"avatar"},
        ])
    });

    const panel=new Ext.grid.EditorGridPanel({
        id:"panel",
        renderTo:document.body,
        style:"margin:auto",
        title:"学生信息系统",
        width:650,
        autoHeight:true,
        loadMask:true,
        store:store,
        cm:cm,
        sm:sm,
        stripeRows: true,
        view: new Ext.grid.GroupingView(),
        tbar:new Ext.Toolbar({
            items:[
                {
                    text:"新增",
                    handler:function () {
                        let initValue={name:'',class:'',sex:'',age:'',birthday:'',avatar:''};
                        let record=new Ext.data.Record(initValue);
                        let checkItems=panel.getSelectionModel().getSelections();
                        let selectItem=checkItems[checkItems.length-1];
                        let insertIndex=Ext.isEmpty(selectItem)?0:store.indexOfId(selectItem.id);
                        if(!Ext.isEmpty(selectItem)){
                            initValue.class=selectItem.data.class;
                        }
                        panel.stopEditing();
                        store.insert(insertIndex,record);
                        panel.startEditing(0,0);
                        record.dirty=true;
                        record.modified=initValue;
                        if(store.modified.indexOf(record)===-1){
                            store.modified.push(record);
                        }
                    }
                },
                {
                    text:"删除",
                    handler:function () {
                        Ext.Msg.confirm('警告','是否确认删除？',function (btn) {
                            if(btn==="yes"){
                                let checkedItems=panel.getSelectionModel().getSelections();
                                checkedItems.forEach(item=>{
                                    store.remove(item);
                                })
                            }
                        })
                    }
                }
            ]
        }),
        bbar:new Ext.PagingToolbar({
            pageSize:6,
            store:store,
            displayInfo:true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
            emptyMsg: "未找到记录"
        }),
        viewConfig: {
            columnsText: '显示',
            sortAscText: 'up',
            sortDescText: 'down',
            forceFit: true
        }
    });
    store.load({params: {start: 0, limit: 6}});
    panel.on('rowcontextmenu',function (grid,rowIndex,e) {
        e.preventDefault();
        panel.getSelectionModel().selectRow(rowIndex);
        contextmenu.showAt(e.getXY());
    })
});