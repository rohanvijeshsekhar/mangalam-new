export const _del_block = async (url, data) => {
    return new Promise ((resolve, reject) => {
        fetch(url,{
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        .then(response => response.text())
        .then(data => {
            resolve(data); 
        })
        .catch(err => {
            reject(err);
        });
    });
}