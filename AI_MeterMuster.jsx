// Meter Muster (Adobe Illustrator Script)
// =======================================
//
// With Meter Muster you can create circular scales, 
// ticks to clusters, clocks, sci-fi assets, motion 
// graphics and so on… Just paly with values and get 
// nice scales to your work easily.
//
// JavaScript Script for Adobe Illustrator CC 2014+
// Tested with Adobe Illustrator CC 2014-2015, Windows 10 64-bit.
// This script provided "as is" without warranty of any kind.
//
// Version History
// 1.0.0 - 2014-09-24
//
// Copyright(c) 2016 Creatide / Sakari Niittymaa
// http://www.creatide.com
// hello@creatide.com
//
// The MIT License (MIT). 
// Full licence can be found from the end of this script.


#target illustrator

// Variables with default values
var app_title = "Meter Muster";
var meter_size = 500;
var segment_count = 60;
var segment_difference = 5;
var line_size = [[2, 20]]; // [width, heigth]
var remove_circle = true;
var first_line_mark = false;

// Color of the first tick
var first_line_color = new RGBColor();
first_line_color.red = 255;
first_line_color.green = 0;
first_line_color.blue = 0;

// Main
function main() {

    // Load UI
    ui_options.ui_get_options();

    // Document Preset
    var doc_preset = new DocumentPreset;
    doc_preset.units = RulerUnits.Pixels;
    doc_preset.width = meter_size;
    doc_preset.height = meter_size;

    // Create new document with custom default values
    var new_doc = app.documents.addDocument(DocumentColorSpace.RGB, doc_preset);
    var ab_bounds = new_doc.artboards[0].artboardRect;
    var stroke_color = new RGBColor();
    new_doc.defaultFilled = false;
    new_doc.defaultStroked = true;
    new_doc.defaultStrokeWidth = 0; // Keep value 0 to avoid stroke width to effect calculations
    stroke_color.red = 0;
    stroke_color.green = 0;
    stroke_color.blue = 0;
    new_doc.defaultStrokeColor = stroke_color;
    doc_center = [new_doc.width / 2, new_doc.height / 2];

    // Create new layer & new path
    var new_layer = new_doc.layers.add();
    var new_circle = new_layer.pathItems.add();
    var lines_group = new_layer.groupItems.add();

    // Create base circle with segments
    makeCircle(segment_count, new_circle, meter_size);

    // Center circle to artboard
    new_circle.top = ((app.activeDocument.height / 2) + (new_circle.height / 2));
    new_circle.left = ((app.activeDocument.width / 2) - (new_circle.width / 2));

    // Rotate circle 90 degrees to get first scale point on top and flip all to get right clockwise
    new_circle.rotate(90, true, true, true, true, Transformation.CENTER);
    flipX(app.activeDocument);

    // Create scale lines
    makeLines(lines_group, new_circle);

    // Remove circle
    if (remove_circle) {
        new_circle.remove()
    }
}

// Make base circle and points for lines
function makeCircle(segment, path, radius) {
    
    var segments = new Array(segment);

    // Calculate path points locations (position & angle)
    for (i = 0; i < segment; i++) {
        var angle = 2 * Math.PI / segment * i;
        segments[i] = new Array(Math.cos(angle) * radius / 2, Math.sin(angle) * radius / 2);
    }

    // Draw path from array of points
    path.setEntirePath(segments);
}

// Make lines
function makeLines(linesGrp, circle) {
    
    for (i = 0; i < circle.pathPoints.length; i++) {
        var line = linesGrp.pathItems.add();

        // Draw extra different scale lines
        if (line_size.length > 1 && (i % segment_difference) == 0) {
            line.setEntirePath([[0, 0], [0, line_size[1][1]]]);
            line.strokeWidth = line_size[1][0];
        } else {
            // Draw only one style lines
            line.setEntirePath([[0, 0], [0, line_size[0][1]]]);
            line.strokeWidth = line_size[0][0];
        }

        // Set custom color for first stroke
        if (i == 0 && first_line_mark) {
            line.strokeColor = first_line_color
        };

        // Set position from circle points
        line.position = [circle.pathPoints[i].anchor[0], circle.pathPoints[i].anchor[1]]

        // Rotate line to toward center
        var angle = getAngle(doc_center, line.position);
        line.rotate(angle - 90, true, true, true, true, Transformation.TOP);
    }
}

// Get angle
function getAngle(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
}

// Flip items (X)
function flipX(item) {
    var totalMatrix = app.getScaleMatrix(-100, 100);

    // Loop all items and flip them
    for (i = 0; i < item.pageItems.length; i++) {
        item.pageItems[i].transform(totalMatrix);
    }
}


// UI for the options window
var ui_options = {

    ui_draw: function () {
        // Layout for UI
        var ui_elements = "dialog { text:'" + app_title + "', \
            panelBase: Panel {text: 'Base Settings', orientation:'column', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                grpMeterSize: Group { orientation: 'row', alignment: 'right', \
                    label: StaticText { text: 'Meter Size (px):' }, \
                    meterSize: EditText { text:'500', characters: 5 } \
                }, \
                grpSteps: Group { orientation: 'row', alignment: 'right', \
                    label: StaticText { text: 'Segments Number:' }, \
                    stepsNumber: EditText { text:'60', characters: 5 } \
                }, \
            }, \
            panelLines: Panel {text: 'Line Settings', orientation:'column', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                panelLineFirst: Panel {text: 'Line 1', orientation:'column', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                    grpLineFirstWidth: Group { orientation: 'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                        label: StaticText { text: 'Width (px):' }, \
                        lineFirstWidth: EditText { text:'2', characters: 5 } \
                    }, \
                    grpLineFirstHeight: Group { orientation: 'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                        label: StaticText { text: 'Height (px):' }, \
                        lineFirstHeight: EditText { text:'20', characters: 5 } \
                    }, \
                }, \
                panelLineSecond: Panel {text: 'Line 2 (Optional)', orientation:'column', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                    grpLineSecondWidth: Group { orientation: 'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                        label: StaticText { text: 'Width (px):' }, \
                        lineSecondWidth: EditText { text:'0', characters: 5 } \
                    }, \
                    grpLineSecondHeight: Group { orientation: 'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                        label: StaticText { text: 'Height (px):' }, \
                        lineSecondHeight: EditText { text:'0', characters: 5 } \
                    }, \
                }, \
                grpDifference: Group { orientation: 'row', alignment:['fill', 'fill'], alignChildren:['fill', 'fill'], \
                    label: StaticText { text: 'Second Line Interval:' }, \
                    lineDifference: EditText { text:'0', characters: 5 } \
                }, \
            }, \
            panelExtras: Panel {text: 'Extras', orientation:'row', alignment: 'center', \
                grpExtras: Group { orientation: 'row', alignment: 'center', \
                    cbKeepCircle: Checkbox{ text:'Keep Circle' }, \
                    cbMarkFirst: Checkbox{ text:'Mark First' }, \
                }, \
            }, \
            grpButtons: Group { orientation: 'row', alignment: 'center', \
                okBtn: Button { text: 'Make Scale', properties: { name: 'ok' } } \
            } \
        }";

        this.win = new Window(ui_elements);
        w = this.win;
        this.win.grpButtons.okBtn.onClick = function () {
            w.close(1);
        };
        this.win.show();
    },

    ui_get_options: function () {
        // Setup window
        this.ui_draw();
        // Set all options to variables
        this.ui_set_options();
        // Make window null after done
        this.win = null;
    },

    // Collect all options from window
    ui_set_options: function () {
        // Base Settings
        meter_size = parseFloat(this.win.panelBase.grpMeterSize.meterSize.text);
        segment_count = parseFloat(this.win.panelBase.grpSteps.stepsNumber.text);
        segment_difference = parseFloat(this.win.panelLines.grpDifference.lineDifference.text);

        // Line Settings Variables
        line_size[0][0] = parseFloat(this.win.panelLines.panelLineFirst.grpLineFirstWidth.lineFirstWidth.text);
        line_size[0][1] = parseFloat(this.win.panelLines.panelLineFirst.grpLineFirstHeight.lineFirstHeight.text);
        line_second_width = parseFloat(this.win.panelLines.panelLineSecond.grpLineSecondWidth.lineSecondWidth.text);
        line_second_height = parseFloat(this.win.panelLines.panelLineSecond.grpLineSecondHeight.lineSecondHeight.text);

        // Check if second line is valid
        if ((line_second_width != NaN && line_second_width != 0) && (line_second_height != NaN && line_second_height != 0)) {
            line_size.push([line_second_width, line_second_height]);
        }

        // Extras
        if (this.win.panelExtras.grpExtras.cbKeepCircle.value) {
            remove_circle = false;
        }
        if (this.win.panelExtras.grpExtras.cbMarkFirst.value) {
            first_line_mark = true;
        }
    }

};

main();

// The MIT License (MIT)
// =====================
// 
// Copyright (c) 2016 Creatide / Sakari Niittymaa
// http://www.creatide.com
// hello@creatide.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.