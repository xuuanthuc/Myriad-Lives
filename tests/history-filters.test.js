import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultHistoryFilters,filterHistory,historyFilterValues} from '../src/utils/historyFilters.js';
import {translate,translateName} from '../src/i18n/index.js';

const entries=[
  {number:1,name:'Lâm Vô Trần',realm:0,status:'finished',age:80,root:'Phàm căn',origin:'Phàm gia',endingReason:'Thọ nguyên đã cạn'},
  {number:2,name:'Diệp Thanh Hà',realm:3,subrealm:1,status:'abandoned',age:320,root:'Thiên linh căn',physique:'Lôi Linh Thể',gender:'Nữ',isGoodProfile:true,sectName:'Thanh Vân Tông',partnerName:'Tần Minh Nguyệt',talent:90,luck:80},
  {number:3,name:'Tần Minh Nguyệt',realm:3,subrealm:2,status:'active',age:260,root:'Thiên linh căn',physique:'Lôi Linh Thể',gender:'Nữ',isGoodProfile:true,sectName:'Thanh Vân Tông',talent:92,luck:90},
];
const numbers=(filters,options)=>filterHistory(entries,filters,options).map(item=>item.number);

test('history combines filters, including mortal realm zero and inclusive age bounds',()=>{
  assert.deepEqual(numbers({realm:'0'}),[1]);
  assert.deepEqual(numbers({realm:'3',status:'active',root:'Thiên linh căn',physique:'Lôi Linh Thể',gender:'Nữ',gifted:'yes',sect:'yes',partner:'no',minAge:'260',maxAge:'260'}),[3]);
  assert.deepEqual(numbers({origin:'Phàm gia',endingReason:'Thọ nguyên đã cạn'}),[1]);
  assert.deepEqual(numbers({minAge:'321',maxAge:'100'}),[]);
  assert.deepEqual(numbers({realm:'0',status:'active'}),[]);
});

test('search supports accents, multiple terms, life numbers and translated names and realms',()=>{
  assert.deepEqual(numbers({query:'diep thanh van'}),[2]);
  assert.deepEqual(numbers({query:'001'}),[1]);
  assert.deepEqual(numbers({query:'pham can tho nguyen'}),[1]);
  for(const language of ['en','zh']){
    const options={t:value=>translate(value,language),localizeName:name=>translateName(name,language)};
    assert.deepEqual(numbers({query:translateName('Diệp Thanh Hà',language)},options),[2]);
    assert.deepEqual(numbers({query:translate('Kim Đan',language)},options),[3,2]);
  }
});

test('sorting is numeric, ranks subrealms and breaks ties by newest life without changing source',()=>{
  const before=structuredClone(entries);
  assert.deepEqual(numbers({}),[3,2,1]);
  assert.deepEqual(numbers({sort:'oldest'}),[1,2,3]);
  assert.deepEqual(numbers({sort:'realm'}),[3,2,1]);
  assert.deepEqual(numbers({sort:'age'}),[2,3,1]);
  assert.deepEqual(numbers({sort:'luck'}),[3,2,1]);
  assert.deepEqual(numbers({sort:'talent'}),[3,2,1]);
  assert.deepEqual(entries,before);
  assert.deepEqual(numbers(defaultHistoryFilters),[3,2,1]);
});

test('old summaries with missing optional traits remain searchable and filterable',()=>{
  assert.deepEqual(numbers({gifted:'no',sect:'no',partner:'no'}),[1]);
  assert.deepEqual(numbers({gender:'Nữ'}),[3,2]);
  assert.deepEqual(historyFilterValues(entries,'root'),['Phàm căn','Thiên linh căn']);
  assert.deepEqual(historyFilterValues(entries,'gender'),['Nữ']);
  assert.deepEqual(filterHistory([],{query:'abc'}),[]);
});
