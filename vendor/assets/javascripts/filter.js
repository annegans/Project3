/*
 * filter.js
 * 2.0.0 (2015-02-26)
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Copyright 2011-2015 Jiren Patel[jirenpatel@gmail.com]
 *
 * Dependency:
 *  jQuery(v1.9 >=)
 */
 
 /*
 * JsonQuery
 * version: 0.0.2 (15/8/2014)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014 Jiren Patel[jirenpatel@gmail.com]
 *
 */

(function(window) {

  'use strict';

  var JsonQuery = function(records, opts){
      return new _JsonQuery(records, opts || {});
  };

  window.JsonQuery = JsonQuery;

  JsonQuery.VERSION = '0.0.2'

  function log(obj){
    if(console && console.log){
      console.log(obj);
    }
  }

  if(!Object.defineProperty){
    Object.defineProperty = function(obj, name, opts){
      obj[name] = opts.get
    }
  }

  var each = function(objs, callback, context){
    if (objs.length === +objs.length) {
      for (var i = 0, l = objs.length; i < l; i++) {
        callback.call(context, objs[i], i);
      }
    }else{
      for (var key in objs) {
        if (hasOwnProperty.call(objs, key)) {
          callback.call(context, objs[key], key);
        }
      }
    }
  };

  var eachWithBreak = function(objs, callback, context){
    for (var i = 0, l = objs.length; i < l; i++) {
      if(callback.call(context, objs[i], i) === false){
        return;
      }
    }
  };

  var _JsonQuery = function(records, opts){
    this.records = records || [];
    this.getterFns = opts.getterFns || {};
    this.lat = opts.latitude || 'latitude';
    this.lng = opts.longitude || 'longitude'
    this.id = opts.id;

    if(this.records.length){
      initSchema(this, records[0], opts.schema);
    }
  };

  var JQ = _JsonQuery.prototype;

  var initSchema = function(context, record, hasSchema){
    context.schema = {};

    if(!context.id){
      context.id = record._id ? '_id' : 'id';
    }

    if(!hasSchema){
      buildSchema.call(context, record);
      buildPropGetters.call(context, record);
    }
  };

  var getDataType = function(val){
    if(val == null){
      return 'String';
    }

    /*
     * @info Fix for IE 10 & 11
     * @bug Invalid calling object
     */
    var type = Object.prototype.toString.call(val).slice(8, -1);

    if(type == 'String' && val.match(/\d{4}-\d{2}-\d{2}/)){
      return 'Date';
    }

    return type;
  };

  var buildSchema = function(obj, parentField){
    var field, dataType, fullPath, fieldValue;

    for(field in obj){
      fieldValue = obj[field];
      dataType = getDataType(fieldValue);

      fullPath = parentField ? (parentField + '.' + field) : field;
      this.schema[fullPath] = dataType;

      if(dataType == 'Object'){
        buildSchema.call(this, fieldValue, fullPath);
      }else if(dataType == 'Array'){

        if(['Object', 'Array'].indexOf(getDataType(fieldValue[0])) > -1){
          buildSchema.call(this, obj[field][0], fullPath);
        }else{
          this.schema[fullPath] = getDataType(fieldValue[0]);
        }
      }
    }
  };

  var parseDate = function(dates){
    if(dates.constructor.name == 'Array'){
      return dates.map(function(d){  return (d ? new Date(d) : null ) });
    }
    return (dates ? new Date(dates) : null);
  };

  var buildPropGetters = function(record){
    var selector, type, val;

    for(selector in this.schema){
      type = this.schema[selector];

      try{
        if(!this.getterFns[selector]){
          this.getterFns[selector] = buildGetPropFn.call(this, selector, type);
        }

        //Remap if it is array
        val = this.getterFns[selector](record);
        if(getDataType(val) == 'Array'){
          this.schema[selector] = 'Array';
        }
      }catch(err){
        console.log("Error while generating getter function for selector : " + selector + " NOTE: Define manually");
      }
    }
  };

  var buildGetPropFnOld = function(field, type){
    var i = 0, nestedPath, accessPath = "", accessFnBody, map;

    nestedPath = field.split('.');

    for(i = nestedPath.length - 1; i >= 0; i--){
      var last = nestedPath[i];
      var parentField = nestedPath.slice(0, i).join('.');

      if(this.schema[parentField] == 'Array'){
        accessPath = accessPath + ".map(function(r){ return r['" + last +"']})"
      }else{
        accessPath = "['" + last +"']"  + accessPath
      }
    }

    if(type == 'Date'){
      accessFnBody = 'var v = obj'+ accessPath +';  return (v ? new Date(v) : null);' ;
    }else{
      accessFnBody = 'return obj'+ accessPath +';' ;
    }

    return new Function('obj', accessFnBody);
  };

  var countArrHierarchy = function(schema, nestedPath){
    var lastArr = 0,
        arrCount = 0,
        path,
        pathLength = nestedPath.length - 1;

    for(var i = nestedPath.length - 1; i >= 0; i--){
      path = nestedPath.slice(0, i + 1).join('.');

      if(schema[path] == 'Array' && i < pathLength){
        lastArr = i;
        arrCount = arrCount + 1;
      }
    }
    return (arrCount > 1 ? (lastArr  + 1) : -1);
  };

  var buildGetPropFn = function(field, type){
    var accessPath = '',
        nestedPath = field.split('.'),
        path,
        lastArr = countArrHierarchy(this.schema, nestedPath),
        prefix,
        accessFnBody;

    for(var i = nestedPath.length - 1; i >= 0; i--){
      path = nestedPath.slice(0, i + 1).join('.');
      prefix = "['" + nestedPath[i] +"']";

      if(this.schema[path] == 'Array'){
        if(lastArr == i){
          accessPath = prefix + (accessPath.length ? ".map(function(r" + i +"){  objs.push(r" + i + accessPath + ")})" : '');
        }else{
          accessPath = prefix + (accessPath.length ? ".map(function(r" + i +"){  return r" + i + accessPath + "})" : '');
        }
      }else{
        accessPath = prefix + accessPath;
      }
    }

    if(lastArr > -1){
      accessFnBody = 'var objs = []; obj' + accessPath + ';' + (this.schema['path'] == 'Date' ?  'return parseDate(objs)'  :  'return objs;');
    }else{
      accessFnBody = 'return ' + (this.schema['path'] == 'Date' ? 'parseDate(obj'+ accessPath +');' : 'obj'+ accessPath +';') ;
    }

    return new Function('obj', accessFnBody);
  };

  JQ.operators = {
    eq: function(v1, v2){ return v1 == v2},
    ne: function(v1, v2){ return v1 != v2},
    lt: function(v1, v2){ return v1 < v2},
    lte: function(v1, v2){ return v1 <= v2},
    gt: function(v1, v2){ return v1 > v2},
    gte: function(v1, v2){ return v1 >= v2},
    in: function(v1, v2){ return v2.indexOf(v1) > -1},
    ni: function(v1, v2){ return v2.indexOf(v1) == -1},
    li: function(v, regx) { return regx.test(v)},
    bt: function(v1, v2){ return (v1 >= v2[0] && v1 <= v2[1])}
  };

  JQ.addOperator = function(name, fn){
    this.operators[name] = fn;
  };

  // rVal = Record Value
  // cVal = Condition Value
  var arrayMatcher = function(rVal, cVal, cFn){
     var i = 0, l = rVal.length;

     for(i; i < l; i++){
       if(cFn(rVal[i], cVal)) return true;
     }
  };

  JQ.addCondition = function(name, func){
    this.operators[name] = func;
  };

  JQ.getCriteria = function(criteria){
    var fieldCondition = criteria.split('.$');

    return {
      field: fieldCondition[0],
      operator: fieldCondition[1] || 'eq'
    };
  };

  JQ.setGetterFn = function(field, fn){
    this.getterFns[field] = fn;
  };

  JQ.addRecords = function(records){
    if(!records || !records.length){
      return false;
    }

    if(getDataType(records) == 'Array'){
      this.records = this.records.concat(records);
    }else{
      this.records.push(records);
    }

    if(!this.schema){
      initSchema(this, records[0]);
    }

    return true;
  };

  JQ._findAll = function(records, qField, cVal, cOpt){
    var result = [],
        cFn,
        rVal,
        qFn = this.getterFns[qField], arrayCFn;

    if(cOpt == 'li' && typeof cVal == 'string'){
      cVal = new RegExp(cVal);
    }

    cFn = this.operators[cOpt];

    if(this.schema[qField] == 'Array'){
      arrayCFn = cFn;
      cFn = arrayMatcher;
    }

    each(records, function(v){
      rVal = qFn(v);

      if(cFn(rVal, cVal, arrayCFn)) {
        result.push(v);
      }
    });

    return result;
  };

  JQ.find = function(field, value){
    var result, qFn;

    if(!value){
      value = field;
      field = this.id;
    }

    qFn = this.getterFns[field];

    eachWithBreak(this.records, function(r){
      if(qFn(r) == value){
        result = r;
        return false;
      }
    });

    return result;
  };

  each(['where', 'or', 'groupBy', 'select', 'pluck', 'limit', 'offset', 'order', 'uniq', 'near'], function(c){
    JQ[c] = function(query){
      var q = new Query(this, this.records);
      q[c].apply(q, arguments);
      return q;
    };
  });

  each(['count', 'first', 'last', 'all'], function(c){
    Object.defineProperty(JQ, c, {
      get: function(){
        return (new Query(this, this.records))[c];
      }
    });
  });

  var compareObj = function(obj1, obj2, fields){
    for(var i = 0, l = fields.length; i < l; i++){
      if(this.getterFns[fields[i]](obj1) !== this.getterFns[fields[i]](obj2)){
        return false;
      }
    }

    return true;
  };

  var execWhere = function(query, records){
    var q, criteria, result;

    for(q in query){
      criteria = this.jQ.getCriteria(q);
      result = this.jQ._findAll(result || records, criteria.field, query[q], criteria.operator);
    }

   return result;
  };

  var execGroupBy = function(field, records){
    var fn = this.jQ.getterFns[field], v, result = {}, i = 0, l = records.length;

    each(records, function(r){
      v = fn(r);
      (result[v] || (result[v] = [])).push(r);
    });

    return result;
  };

  var execOrder = function(orders, records){
    var fn,
        direction,
        _records = records.slice(0);

    for(var i = 0, l = orders.length; i < l; i++){
      fn = this.jQ.getterFns[orders[i].field],
        direction = orders[i].direction == 'asc' ? 1 : -1;

      _records.sort(function(r1,r2){
        var a = fn(r1), b = fn(r2);

        return (a < b ? -1 : a > b ? 1 : 0)*direction;
      })
    }

    return _records;
  };

  var execSelect = function(fields, records){
    var self = this, result = [], getFn;

    each(fields, function(f){
      getFn = self.jQ.getterFns[f];

      each(records, function(r, i){
        (result[i] || (result[i] = {}))[f] = getFn(r);
      });
    });

    return result;
  };

  var execPluck = function(field, records){
    var getFn = this.jQ.getterFns[field], result = [];

    each(records, function(r){
      result.push(getFn(r));
    });

    return result;
  };

  var execUniq = function(fields, records){
    var result = [], self = this;

    if(getDataType(records[0]) != 'Object'){
      each(records, function(r){
        if(result.indexOf(r) == -1){
          result.push(r);
        }
      });

      return result;
    }

    result.push(records[0]);

    each(records, function(r){
      var present = false;

      for(var i = 0, l = result.length; i < l; i++){
        if(compareObj.call(self.jQ, result[i], r, fields)){
          present = true;
        }
      }

      if(!present){
        result.push(r);
      }
    });

    return result;
  };

  var Query = function(jQ, records){
    this.jQ = jQ;
    this.records = records;
    this.criteria = {};
    return this;
  };

  var Q = Query.prototype;

  Q.each = function(callback, context){
    each(this.exec() || [], callback, context)
  };

  Q.exec = Q.toArray = function(callback){
    var result, c;

    if(this.criteria['all']){
      result = this.records;
    }

    if(this.criteria['where']){
      result = execWhere.call(this, this.criteria['where'], result || this.records);
    }

    if(this.criteria['or']){
      result = result.concat(execWhere.call(this, this.criteria['or'], this.records));
      result = execUniq.call(this, [this.jQ.id], result);
    }

    if(this.criteria['order']){
      result = execOrder.call(this, this.criteria['order'], result || this.records);
    }

    if(this.criteria['near']){
      result = execNear.call(this, this.criteria['near'], result || this.records);
    }

    if(this.criteria['uniq']){
      result = execUniq.call(this, this.criteria['uniq'], result || this.records);
    }

    if(this.criteria['select']){
      result = execSelect.call(this, this.criteria['select'], result || this.records);
    }

    if(this.criteria['pluck']){
      result = execPluck.call(this, this.criteria['pluck'], result || this.records);
    }

    if(this.criteria['limit']){
      result = (result || this.records).slice(this.criteria['offset'] || 0, (this.criteria['offset'] || 0) + this.criteria['limit']);
    }

    if(this.criteria['group_by']){
      result = execGroupBy.call(this, this.criteria['group_by'], result || this.records);
    }

    if(callback){
      each(result || this.records, callback);
    };

    if(!result){
      result = this.records;
    }

    if(this.jQ.onResult){
      this.jQ.onResult(result, this.criteria);
    }

    return result;
  }

  var addToCriteria = function(type, query){
    var c;

    if(!this.criteria[type]){
      this.criteria[type] = {};
    }

    for(c in query){
      this.criteria[type][c] = query[c];
    }

    return this;
  };

  Q.where = function(query){
    return addToCriteria.call(this, 'where', query);
  };

  Q.or = function(query){
    return addToCriteria.call(this, 'or', query);
  };

  Q.groupBy = function(field){
    this.criteria['group_by'] = field;
    return this;
  };

  Q.select = function(){
    this.criteria['select'] = arguments;
    return this;
  };

  Q.pluck = function(field){
    this.criteria['pluck'] = field;
    return this;
  };

  Q.limit = function(l){
    this.criteria['limit'] = l;
    return this;
  };

  Q.offset = function(o){
    this.criteria['offset'] = o;
    return this;
  };

  Q.order = function(criteria){
    var field;
    this.criteria['order'] = this.criteria['order'] || [];

    for(field in criteria){
      this.criteria['order'].push({field: field, direction: criteria[field].toLowerCase()});
    }

    return this;
  };

  Q.uniq = function(){
    this.criteria['uniq'] = (arguments.length > 0 ? arguments : true);
    return this;
  };

  Object.defineProperty(Q, 'count', {
    get: function(){
      this.criteria['count'] = true;
      var r = this.exec();

      if(getDataType(r) == 'Array'){
        return this.exec().length;
      }else{
        return Object.keys(r).length;
      }
    }
  });

  Object.defineProperty(Q, 'all', {
    get: function(){
      this.criteria['all'] = true;
      return this.exec();
    }
  });

  Object.defineProperty(Q, 'first', {
    get: function(){
      this.criteria['first'] = true;
      return this.exec()[0];
    }
  });

  Object.defineProperty(Q, 'last', {
    get: function(){
      this.criteria['last'] = true;
      var r = this.exec();
      return r[r.length - 1];
    }
  });

  //Geocoding
  var GEO = {
    redius: 6371,
    toRad: function(v){
      return v * Math.PI / 180;
    }
  };

  var calculateDistance = function(lat1, lat2, lng1, lng2){
    var dLat = GEO.toRad(lat2 - lat1),
        dLon = GEO.toRad(lng2 - lng1),
        lat1 = GEO.toRad(lat1),
        lat2 = GEO.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

    return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) * GEO.redius;
  };

  var execNear = function(opts, records){
    var result = [],
        self = this,
        unit_c = opts.unit == 'mile' ? 0.6214 : 1,
        latFn = self.jQ.getterFns[self.jQ.lat],
        lngFn = self.jQ.getterFns[self.jQ.lng];

    each(records, function(r){
      r._distance = calculateDistance(latFn(r), opts.lat, lngFn(r), opts.lng) * unit_c;

      if(r._distance <= opts.distance){
        result.push(r);
      }
    });

    result.sort(function(a, b){
      return (a._distance < b._distance ? -1 : a._distance > b._distance ? 1 : 0);
    })

    return result;
  };

  Q.near = function(lat, lng, distance, unit){
    this.criteria['near'] = {lat: lat, lng: lng, distance: distance, unit: (unit || 'km')};
    return this;
  };

  //Helpers
  Q.map = Q.collect = function(fn){
    var result = [], out;

    this.exec(function(r){
      if(out = fn(r)){
        result.push(out);
      }
    })
    return result;
  };

  Q.sum = function(field){
    var result = 0,
        group,
        getFn = this.jQ.getterFns[field];

    if(this.criteria['group_by']){
      group = true;
      result = {};
    }

    this.exec(function(r, i){
      if(group){
        result[i] = 0;

        each(r, function(e){
          result[i] = result[i] + (getFn(e) || 0);
        })
      }else{
        result = result + (getFn(r) || 0);
      }
    });

    return result;
  };

  Q.toJQ = function(){
    var q = JsonQuery(this.all, {schema: true});
    q.schema = this.jQ.schema;
    q.getterFns = this.jQ.getterFns;

    return q;
  };

})(this);

//In IE indexOf method not define.
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  }
}

;(function($, window, document) {

"use strict";


var FilterJS = function(records, container, options) {
  var fjs = new FJS(records, container, options);
  FilterJS.list.push(fjs);

  return fjs;
};

FilterJS.VERSION = '2.0.0';
FilterJS.list = [];

$.fn.filterjs = function(records, options) {
  var $this = $(this);

  if (!$this.data('fjs')){
    $this.data('fjs', FilterJS(records, $this, options));
  }
};

window.FilterJS = FilterJS;

var FJS = function(records, container, options) {
  var self = this;

  this.opts = options || {};
  this.callbacks = this.opts.callbacks || {};
  this.$container = $(container);
  this.view = this.opts.view || renderRecord;
  this.templateFn = this.template($(this.opts.template).html());
  this.criterias = [];
  this._index = 1;
  this.appendToContainer = this.opts.appendToContainer || appendToContainer;

  $.each(this.opts.criterias || [], function(){
    self.addCriteria(this);
  });

  this.Model = JsonQuery();
  this.Model.getterFns['_fid'] = function(r){ return r['_fid'];};
  this.addRecords(records);
};

var F = FJS.prototype;

Object.defineProperty(F, 'records', {
  get: function(){ return this.Model.records; }
});

Object.defineProperty(F, 'recordsCount', {
  get: function(){ return this.Model.records.length; }
});

//View Template
// Ref: Underscopre.js
//JavaScript micro-templating, similar to John Resig's implementation.
var templateSettings = {
  // evaluate    : /<%([\s\S]+?)%>/g,
  evaluate    : /{{([\s\S]+?)}}/g,
  // interpolate : /<%=([\s\S]+?)%>/g,
  interpolate : /{{=([\s\S]+?)}}/g,
  escape      : /<%-([\s\S]+?)%>/g
};

var escapeStr = function(string) {
  return (''+string).replace(/&/g,  '&amp;')
                    .replace(/</g,  '&lt;')
                    .replace(/>/g,  '&gt;')
                    .replace(/"/g,  '&quot;')
                    .replace(/'/g,  '&#x27;')
                    .replace(/\//g, '&#x2F;');
};

F.template = function(str, data) {
  var c  = templateSettings;
  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    str.replace(/\\/g, '\\\\')
       .replace(/'/g, "\\'")
       .replace(c.escape, function(match, code) {
         return "',escapeStr(" + code.replace(/\\'/g, "'") + "),'";
       })
       .replace(c.interpolate, function(match, code) {
         return "'," + code.replace(/\\'/g, "'") + ",'";
       })
       .replace(c.evaluate || null, function(match, code) {
         return "');" + code.replace(/\\'/g, "'")
                            .replace(/[\r\n\t]/g, ' ') + ";__p.push('";
       })
       .replace(/\r/g, '\\r')
       .replace(/\n/g, '\\n')
       .replace(/\t/g, '\\t')
       + "');}return __p.join('');";

  var func = new Function('obj', tmpl);
  return data ? func(data) : function(data) { return func(data) };
};

//Callback
F.execCallback = function(name, args){
  if(this.callbacks[name]) {
    this.callbacks[name].call(this, args);
  }
};

F.addCallback = function(name, fns){
  if(name && fns){
    this.callbacks[name] = fns;
  }
};

//Add Data
F.addRecords = function(records){
  var has_scheme = !!this.Model.schema;

  this.execCallback('beforeAddRecords', records);

  if(this.Model.addRecords(records)){
    if(!this.has_scheme){
      this.initSearch(this.opts.search);
    }

    this.render(records);
    this.filter();
  }

  this.execCallback('afterAddRecords', records);
};

F.removeRecords = function(criteria){
  var ids;

  if($.isPlainObject(criteria)){
    ids = this.Model.where(criteria).pluck('_fid').all;
  }else if($.isArray(criteria)){
    ids = this.Model.where({'id.$in': criteria}).pluck('_fid').all;
  }

  if(!ids){
    return false;
  }

  var records = this.Model.records, 
      removedCount = 0,
      idsLength = ids.length,
      fid;

  for(var i = records.length - 1; i > -1; i--){
    fid = records[i]._fid

    if(ids.indexOf(fid) > -1){
      records.splice(i, 1);
      removedCount ++;

      $('#fjs_' + fid).remove();
    } 

    if(removedCount == idsLength){
      break;
    }
  }

  this.execCallback('afterRemove');

  return true;
};

var renderRecord = function(record, index){
  return this.templateFn(record);
};

F.render = function(records){
  var self = this, ele;

  if(!records.length){return; }

  this.execCallback('beforeRender', records);

  var cbName = 'beforeRecordRender';

  $.each(records, function(i){
    self.execCallback(cbName, this);
    this._fid = (self._index++);

    ele = self.view.call(self, this, i);
    if (typeof ele === 'string') ele = $($.trim(ele));
    ele.attr('id', 'fjs_' + this._fid);
    ele.addClass('fjs_item');

    self.appendToContainer(ele, this);
  });
};

var appendToContainer = function(htmlele, record){
  this.$container.append(htmlele);
};

var setDefaultCriteriaOpts = function(criteria){
  var ele = criteria.$ele,
      eleType = criteria.$ele.attr('type');

  if(!criteria.selector){
    if (ele.get(0).tagName == 'INPUT'){
      criteria.selector = (eleType == 'checkbox' || eleType == 'radio') ? ':checked' : ':input';
    }else if (ele.get(0).tagName == 'SELECT'){
      criteria.selector = 'select';
    }
  }

  if (!criteria.event){
    criteria.event = (eleType == 'checkbox' || eleType == 'radio') ? 'click' : 'change';
  }

  return criteria;
};

F.addCriteria = function(criterias){
  var self = this;

  if(!criterias){ return false; }

  if($.isArray(criterias)){
    $.each(criterias, function(){
      addFilterCriteria.call(self, this);
    });
  }else{
    addFilterCriteria.call(self, criterias);
  }

  return true;
};

// Add Filter criteria
// criteria: { ele: '#name', event: 'check', field: 'name', type: 'range' }
var addFilterCriteria = function(criteria){
  if(!criteria || !criteria.field || !criteria.ele){
    return false;
  }

  criteria.$ele = $(criteria.ele);

  if(!criteria.$ele.length){
    return false;
  }

  criteria = setDefaultCriteriaOpts(criteria);
  this.bindEvent(criteria.ele, criteria.event);

  criteria._q = criteria.field + (criteria.type == 'range' ? '.$bt' : '')
  criteria.active = true;

  this.criterias.push(criteria);

  return true;
};

F.removeCriteria = function(field){
  var self = this, criteria, index;

  $.each(self.criterias, function(i){
    if(this.field == field){
      index = i;
    }
  });

  if(index != null){
    criteria = this.criterias.splice(index, 1)[0];
    $('body').off(criteria.event, criteria.ele)
  }
};

var changeCriteriaStatus = function(names, active){
  var self = this;

  if(!names){ return; }

  if(!$.isArray(names)){
    names = [names]
  }

  $.each(names, function(){
    var name = this;

    $.each(self.criterias, function(){
      if(this.field == name){
        this.active = active;
      }
    })
  });
};

F.deactivateCriteria = function(names){
  changeCriteriaStatus.call(self, names, false);
};

F.activateCriteria = function(names){
  changeCriteriaStatus.call(this, names, true);
};

var getSelectedValues = function(criteria, context){
  var vals = [];

  criteria.$ele.filter(criteria.selector).each(function() {
    vals.push($(this).val());
  });

  if($.isArray(vals[0])){
    vals = [].concat.apply([], vals);
  }

  if(criteria.all && vals.indexOf(criteria.all) > -1){
    return [];
  }
  if(criteria.type == 'ra

...