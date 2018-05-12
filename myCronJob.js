const myCronJob = () => {
  console.log("every 2 min")
}

const getCreated = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    let json_metadata = {};
    let paymentValue = 0;
    let posted = '';
    let duration = '';
    let pv = '';
    var query = {
      tag: 'dpornclassicupload',
      limit: 50,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByCreated(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted,
              permlink: element.permlink
            }
            data.push(item);
        });
        latests = data;
        //console.log('l', latests)
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
  return promise;
};

const getHot = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    var query = {
      tag: 'dpornclassicupload',
      limit: 50,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByHot(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted,
              permlink: element.permlink
            }
            data.push(item);
        });
        hot = data;
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
  return promise;
};

const getTrending = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    var query = {
      tag: 'dpornclassicupload',
      limit: 50,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByTrending(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted,
              permlink: element.permlink
            }
            data.push(item);
        });
        trending = data;
        resolve(1);
      } else {
        resolve(1);
      }
    });
  });
  return promise;
};

module.exports = myCronJob;