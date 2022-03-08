var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var validUrl = require("valid-url");
const pa11y = require("pa11y");
var fs = require("fs");
const { empty } = require("cheerio/lib/api/manipulation");
var router = express.Router();
const md5 = require("md5");

const alertMessage =
	'<div class="alert alert-danger" role="alert">Something went wrong</div>';
const emptyUrl =
	'<div class="alert alert-danger" role="alert">Please add an URL</div>';
const warningMessage =
	'<div class="alert alert-warning" role="alert">no Issues Found</div>';
const CsvMessage =
	'<div class="alert alert-warning" role="alert">CSV not available</div>';

const SuccessMessage =
	'<div class="alert alert-success" role="alert">Check report</div>';

/* GET child Report page. */
router.get("/", async function (req, res, next) {
	var sqlI =
		"SELECT scan_id , errors, warnings, notices, total,version FROM scanreport ORDER BY scan_id DESC LIMIT 1";
	db.query(sqlI, function (err, results) {
		var scanID = results[0].scan_id;
		var version = results[0].version;

		var sql =
			"SELECT `web_id`, `weburl`, `folder` FROM `webcrawling` WHERE notices =0 AND warnings =0 AND errors =0 AND scan_id = '" +
			scanID +
			"' limit 8";
		db.query(sql, function (err, results) {
			if (results.length) {
				var getURL = [];
				for (let i = 0; i < results.length; i++) {
					getURL.push(results[i].weburl);
					var folderName = results[0].folder;
				}
				//console.log(getURL);
				getChildUrlData(getURL, folderName, version);

				res.send("Done");
			} else {
				var update =
					"UPDATE `scanreport` SET `status`='Completed' WHERE `scan_id`='" +
					scanID +
					"'";
				//console.log(update);
				db.query(update, function (err, result) {});
			}
		});
	});

	var getChildUrlData = async (url, folderName, version) => {
		try {
			if (version == "WCAG 2.0") {
				var ignore = [
					"WCAG2AA.Principle1.Guideline1_3.1_3_4.RestrictView",
					"WCAG2AA.Principle1.Guideline1_3.1_3_5_H98.FaultyValue",
					"WCAG2AAA.Principle1.Guideline1_3.1_3_6_ARIA11.Check",
					"WCAG2AA.Principle1.Guideline1_4.1_4_10_C32,C31,C33,C38,SCR34,G206.Check",
					"WCAG2AA.Principle1.Guideline1_4.1_4_11_G195,G207,G18,G145,G174,F78.Check",
					"WCAG2AA.Principle1.Guideline1_4.1_4_12_C36,C35.Check",
					"WCAG2AA.Principle1.Guideline1_4.1_4_13_F95.Check",
					"WCAG2A.Principle1.Guideline2_1.2_1_4.Check",
					"WCAG2A.Principle1.Guideline2_2.2_2_6.Check",
					"WCAG2AAA.Principle1.Guideline2_3.2_3_3.Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_1.Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_2.SinglePointer_Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_2.Mousedown_Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_2.Touchstart_Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_2.Touchstart_Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_3_F96.AccessibleName",
					"WCAG2A.Principle1.Guideline2_5.2_5_4.Check",
					"WCAG2A.Principle1.Guideline2_5.2_5_4.Devicemotion",
					"WCAG2AAA.Principle1.Guideline2_5.2_5_5.Check",
					"WCAG2AAA.Principle1.Guideline2_5.2_5_6.Check",
					"WCAG2AA.Principle1.Guideline4_1.4_1_3_ARIA22,G199,ARIA19,G83,G84,G85,G139,G177,G194,ARIA23.Check",
				];
			} else {
				var ignore = "";
			}
			const options = {
				waitUntil: "load",
				timeout: 900000000,
				//includeNotices: true,
				includeWarnings: true,
				runners: ["axe", "htmlcs"],
				ignore: ignore,
			};

			let len = url.length;
			var pally = [];
			for (let i = 0; i < len; i++) {
				var urls = url[i];

				if (validUrl.isUri(urls)) {
					var setPal = pa11y(urls, options);

					pally.push(setPal);
				} else {
					// var urlID = "webdamn";
					// var turls = "https://" + urlID + "/" + urls;
					// var setPal = pa11y(turls, options);
					// pally.push(setPal);
					// console.log(turl);
					// geturlData(turl, folderName);
				}
			}

			// Run tests against multiple URLs
			const results = await Promise.all(pally);

			for (let k = 0; k < results.length; k++) {
				var getName = results[k].documentTitle.split("/").toString();
				if (getName == "") {
					getName = "< Missing title >" + results[k].pageUrl;
				}

				var iname = getName.replace(/[^A-Z0-9]/gi, "_");

				var name = md5(iname) + ".json";

				var dir = "public/json/" + folderName;
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				var filename = "public/json/" + folderName + "/" + name;
				const content = JSON.stringify(results[k]);
				fs.writeFileSync(filename, content);
			}

			var gSut = addChildreport(results);
		} catch (error) {
			for (let j = 0; j < url.length; j++) {
				try {
					await pa11y(url[j], {});
				} catch (error) {
					deleteQ =
						"DELETE FROM `webcrawling` WHERE `weburl`='" +
						url[j] +
						"'";
					db.query(deleteQ, function (err, result) {});
				}
			}
		}
	};
});

const addChildreport = function (req, res, next) {
	//console.log("addchild");

	var message = "";
	var numErrorsI = 0;
	var numNoticesI = 0;
	var numWarningI = 0;
	var totalI = 0;

	var sqlI =
		"SELECT scan_id , errors, warnings, notices, total FROM scanreport ORDER BY scan_id DESC LIMIT 1";
	db.query(sqlI, function (err, results) {
		try {
			var scanID = results[0].scan_id;
			for (let k = 0; k < req.length; k++) {
				var webname = req[k].documentTitle;
				var url = req[k].pageUrl;
				if (webname == "") {
					webname = "< Missing title >" + url;
				}

				if (url.substring(url.length - 1) == "/") {
					url = url.substring(0, url.length - 1);
				}

				var reUrl = url + "/";

				var issues = req[k].issues;

				var numErrors = issues.reduce(function (n, person) {
					return n + (person.typeCode == 1);
				}, 0);
				var numWarning = issues.reduce(function (n, person) {
					return n + (person.typeCode == 2);
				}, 0);
				var numNotices = issues.reduce(function (n, person) {
					return n + (person.typeCode == 3);
				}, 0);
				var total = numErrors + numWarning + numNotices;
				var merge = "('" + url + "', '" + reUrl + "')";

				var sql =
					"UPDATE `webcrawling` SET `webname`='" +
					webname +
					"',`errors`='" +
					numErrors +
					"',`notices`='" +
					numNotices +
					"',`warnings`='" +
					numWarning +
					"',`total`='" +
					total +
					"' WHERE `weburl` IN" +
					merge +
					" ";

				db.query(sql, function (err, result) {
					message = SuccessMessage;
				});

				numErrorsI += numErrors;
				numNoticesI += numNotices;
				numWarningI += numWarning;
				totalI += total;
			}
			var upErrors = numErrorsI + results[0].errors;
			var upNotices = numNoticesI + results[0].notices;
			var upWarnings = numWarningI + results[0].warnings;
			var uptotals = totalI + results[0].total;

			var update =
				"UPDATE `scanreport` SET `errors`='" +
				upErrors +
				"',`warnings`='" +
				upWarnings +
				"',`notices`='" +
				upNotices +
				"',`total`='" +
				uptotals +
				"' WHERE `scan_id`='" +
				scanID +
				"'";
			//console.log(update);
			db.query(update, function (err, result) {});
		} catch (error) {}
	});
	return true;
};

module.exports = router;
