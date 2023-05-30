const myFirebaseFunction = (heading, desc, refArr, imgRefArr) => {
    var data = {
      Title: heading,
      Description: desc,
      Status: true,
      Questions: refArr,
      Images: imgRefArr
    };
  
    return data;
  }