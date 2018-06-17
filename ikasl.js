/**
 * Created by supun on 6/17/18.
 */

var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.get('/', (req, res) => {
    res.render('ikasl');
});

router.get('/:dataset', (req, res) => {
    res.render('Executing.....');

    var dataset = req.params.dataset;
    var dataset_path = '/media/supun/New\\ Volume/FYP/Discussion\\ Pathways/IKASL\\ Java\\ Implementation/datasets/' + dataset + '/';

    // execute the java-ikasl giving the dataset paths
    var command = 'java -cp TextFeatureExtractor.jar ExtractFeatures -f daily -p ' + dataset_path;

    exec(command, (err, stdout, stderr) => {
        if (err){
            return res.send("Error: " + err);
        }

        res.send("Preprocessing done. Running IKASL...");

        command = 'java -cp IKASL.jar com.algorithms.test.TestIKASL_TextDatabased_EventDetection_new_data -p '+ dataset_path + '-htf 0.5';
        exec(command, (err, stdout, stderr) => {
            if (err) return res.send("Error :0 + err");

            res.send("IKASL completed. Results Saved");
        });
    });
});



module.exports = router;