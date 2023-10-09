export default (error, req, res, next) =>{
    switch(Math.floor(error.code / 100)){
        case 1:
            res.status(400).send({
                status: 'error',
                error: error.message,
              });
            break;
        case 2: 
            res.status(403).send({
                status: 'error',
                error: error.message,
            });
            break;
        case 3:
            res.status(500).send({
                status: 'error',
                error: 'Unhanddled error',
              });
            break;
        default:
            res.status(500).send({
                status: 'error',
                error: 'Unhanddled error',
              });
    }
}