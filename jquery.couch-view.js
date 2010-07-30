
(function($) {
  
        
   $.fn.couchview = function(options) {

   function Grid (obj, options) {
        this.obj = obj;
        this.options = options;
        this.url = this.options.url;
        this.limit = options.limit;
        this.offset = 0;
        this.total_rows =0;
        this.rows=[];
        this.data = {},
        this.key = options.key;
        this.descending = false;
        var grid = this;
        this.load = function () {
                grid.data={}
                var data = {limit: this.limit, skip: this.offset, descending:this.descending};
                $.ajax({
                url: this.url+this.key,
                dataType: "jsonp",
                contentType: "application/json", 
                data: data,
                success: function(data, textStatus, request) {
                        obj.find('.status').html("Loaded:"+ textStatus+" - "+ request)
                        var markup = ""; 
                        grid.limit = data['rows'].length;
                        grid.offset = data['offset'];
                        grid.total_rows = data['total_rows'];
                        $.fn.couchview.table(grid, obj, options, data);
                        $.fn.couchview.pager(grid, obj, options, data);
                        
                        
                        
                        $(".edit").editable(function(value, settings) {
                          var cell = $(this);
                          
                          /* 
                          $.couch.urlPrefix='http://169.39.30.172:5984';
                          $.couch.db("mydb")
                          var doc = $.couch.db("mydb").openDoc(cell.attr('_id'));
                          alert(doc);
                          var fields = $('[_id='+ cell.attr('_id')+']');
                          alert(fields.length);
                          var rec = {
                                _rev: cell.attr('_rev')
                                };
                          
                          rec[ cell.attr('id')] = value;
                          for (var i =0; i < fields.length; i++) {
                                var c = $(fields[i]);
                                alert(c.attr('id')+'---'+cell.attr('id') )
                                if (c.attr('id') != cell.attr('id') ) {
                                rec[c.attr('id')] = c.html();
                                }
                          }
                          */
                          var rec = grid.data[cell.attr('_id')];
                          var oldvalue = rec[cell.attr('id')];
                          var fieldtype = typeof(oldvalue);
                          if (fieldtype  != 'string') {
                            value = eval(value);
                         }
                            
                          rec[cell.attr('id')] = value;
                          var url = 'http://169.39.30.172/couch/mydb/'+cell.attr('_id');
                          var data = JSON.stringify(rec);
                          alert(data);
                          alert(url);
                      
                         $.ajax({
                                //processDataBoolean: false,
                                type: 'PUT',
                                url: url,
                                //url: "http://localhost:8000/mydb/"+cell.attr('_id'),
                                //url: "http://69.164.211.38/mydb/"+cell.attr('_id'),
                                dataType: "json",
                                data: data,
                                success: function(data, textStatus, request) {
                                        alert('SUCCESS textStatus:'+ textStatus+'['+data+']');
                                        grid.data[cell.attr('_id')]['_rev'] = data.rev;
                                        grid.data[cell.attr('_id')]['_rev'] = value;
                                    },
                                error : function(XMLHttpRequest, textStatus, errorThrown) {
                                        alert('3 ERROR textStatus:'+ textStatus+":"+errorThrown);
                                    }
                                });
                                
                         /*      
                          var url = "http://169.39.30.172/couch/mydb/_design/tests/_update/inplace/"+cell.attr('_id')+"?field="+cell.attr('id')+"&value="+value;
                          var data = JSON.stringify(rec);
                          alert(url);
                            var rec3 = {field: cell.attr('id'), value: value};
                            $.ajax({
                                type: 'PUT',
                                url: url,
                                 dataType: "json",
                                //data: rec3,
                                success: function(data, textStatus, request) {
                                    alert('44textStatus:'+ textStatus);
                                },
                                error : function(XMLHttpRequest, textStatus, errorThrown) {
                                    alert('44textStatus:'+ textStatus);
                                }
                                });
                               
                           */    
                                return value;
                            }); 
                        },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("NOT LOADED"+textStatus);
                        obj.html('failed:'+textStatus, +', '+errorThrown);
                        obj.find('.status').html("Loaded:"+ textStatus+" - "+ request)
                    }
            });
        };
    }
   
   
 
    var config =  $.extend({}, $.fn.couchview.defaults, options);
    var grids= {};
 
     return this.each(function() {
            var $this = $(this);
            var id = $this.attr('id');
            var opts = $.meta ?  $.extend({}, config, $this.data()) : config;
            grids[id] =  new Grid($this, opts);
            $.fn.couchview.header(grids[id], $this, opts, {});
            grids[id].load();
        }); 
        
        
       };
       
       
     $.fn.couchview.header = function (grid, obj, options, data) {
            obj.find('.data-sort').click(function(event){
                if (this.id != grid.key) {
                    grid.key = this.id; 
                } else {
                    grid.descending = !grid.descending;
                }
                grid.load();
                event.preventDefault();
                
            });
        };   
        
        $.fn.couchview.pager = function (grid, obj, options, data) {
            obj.find('.pager-first').click(function(event){
                grid.offset=0;
                obj.find('.pager-page').html(grid.offset);
                event.preventDefault();
                grid.load();
            });
             obj.find('.pager-prev-page').click(function(event){
                grid.offset = grid.offset >= grid.limit ? grid.offset- grid.limit : 0;
                obj.find('.pager-page').html(grid.offset);
                event.preventDefault();
                grid.load();
            });
            obj.find('.pager-prev').click(function(event){
                grid.offset = grid.offset > 0 ? grid.offset- 1 : 0;
                obj.find('.pager-page').html(grid.offset);
                grid.load();
                event.preventDefault();
                
            });
             obj.find('.pager-page').html(grid.offset);
             
             obj.find('.pager-next').click(function(event){
             
                grid.offset =  grid.offset+1;
                obj.find('.pager-page').html(grid.offset);
                event.preventDefault();
                grid.load();
            });
             obj.find('.pager-next-page').click(function(event){
                var g = grid;
                grid.offset = grid.offset + grid.limit < grid.total_rows ? grid.offset + grid.limit: grid.offset;
                 obj.find('.pager-page').html(grid.offset);
                  grid.load();
                event.preventDefault();
               
            });
             obj.find('.pager-last').click(function(event){
               grid.offset=grid.total_rows;
               obj.find('.pager-page').html(grid.offset);
                event.preventDefault();
                grid.load();
            }); 
        };   
        //
     $.fn.couchview.table = function (grid, obj, options, data) {
            var anchor = obj.find('.data-body');
            if (grid.rows.length == 0) {
                var evenRowTemplate = obj.find('.data-row-even');
                var oddRowTemplate = null;
                if (evenRowTemplate.length  == 0) { 
                    evenRowTemplate = obj.find('.data-row');
                    oddRowTemplate = evenRowTemplate;
                } else {
                    oddRowTemplate = obj.find('.data-row-odd');   
                }
                for (var i=0; i < grid.limit; i++) {
                    grid.rows[i] = i % options.row_mod ==0 ? evenRowTemplate.clone() : oddRowTemplate.clone() ;
                    grid.rows[i].appendTo(anchor);
                }
                evenRowTemplate.hide();
                oddRowTemplate.hide();
            }
          
            $.each(data['rows'], function(rowCount, row) {
                        grid.data[row['value']['_id']] = row['value'];
                        grid.rows[rowCount].attr('record', row);
                        grid.rows[rowCount].find('.field').each(function(index, cell) {
                            var record = row;
                            var id = cell.id;
                            cell.innerHTML = record['value'][id];
                           $(cell).attr({
                                _id: record['value']['_id'],
                               // _rev: record['value']['_rev']
                                }); 
                             /*$(cell).innerHTML = record['value'][field];
                            */
                    });
            });
            
        };   
          
   
   
   $.fn.couchview.defaults = {
        limit: 10,
        row_mod: 2,
        key: 'id'
    };
 
 })(jQuery);
