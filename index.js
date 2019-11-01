const path = require('path');
const fsp = require('fs').promises;
const { format, formatDistance, formatRelative, subDays } = require('date-fns');

//joining path of directory
const directoryPath = path.join(__dirname, 'images');
//passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     }
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         console.log(file);
//     });
// });



// const readFile = async (dirPath, fileName) => {
//     try {
//         const file = await fsp.readFile(`${dirPath}${fileName}`);
//         return file;
//     } catch (error) {
//         console.log(error);
//     }
// }


const init = async () => {
    const readDirectory = async (dirPath) => {
        try {
            const files = await fsp.readdir(dirPath);
            return files;
        } catch (error) {
            console.log(error);
        }
    };

    const filesArray = await readDirectory(directoryPath);

    console.log('filesArray', filesArray);

    const filePromise = filesArray.reduce((current, next) => {
        current.push(
            fsp.stat(`${directoryPath}/${next}`)
        );
        return current;
    }, [])

    const res = await Promise.all(filePromise);

    console.log(res);

    const object = filesArray.reduce((current, next, index) => {
        const obj = {
            fileName: next,
            newFileName: format(res[index].ctime, "yyyy-mm-dd_hhmmss'.JPG'"),
            stat: res[index],
        };
        current.push(obj);
        return current;
    }, []);

    console.log(object);

    const changeNamePromiseArray = object.map((item) => {
        return fsp.rename(
            `${directoryPath}/${item.fileName}`,
            `${directoryPath}/${item.newName}`
        )
    });

    console.log(changeNamePromiseArray);

    // const final = await Promise.all(changeNamePromiseArray);
    // console.log('final', final);


    // const filesObject = filesArray.reduce((current, next) => {
    //     const object = current;
    //     const file = readFile(directoryPath, next);
    //     object[next] = {
    //         file,
    //     }
    //     return object;
    // }, {})

    // return await filesObject(filesArray);
}


console.log(init());



// var fs = require('fs');
// fs.rename('/path/to/Afghanistan.png', '/path/to/AF.png', function(err) {
//     if ( err ) console.log('ERROR: ' + err);
// });