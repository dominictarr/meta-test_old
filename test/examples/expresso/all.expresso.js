

exports ['pass'] = function (assert){

  assert.ok(true);

}


exports ['fail'] = function (assert){

  assert.ok(false,"INTENSIONAL FAIL");

}


exports ['error'] = function (assert){

  throw new Error("INTENSIONAL ERROR");

}




