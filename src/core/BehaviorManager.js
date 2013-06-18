/*

TODO: dont know how to change addbehavior and createbheavior yet
*/


Jasper.BehaviorManager = function () {

    this._beh_BehObjPairs = {};

    this._name_beh = {
        //'move': MoveBehavior,
        'circle': Jasper.CircleDrawBehavior,
        'testmove': Jasper.RandomMoveBehavior,
        'mouse': Jasper.MouseBehavior
    };

    this._nonUpdateBehaviors = ['mouse'];

};


Jasper.BehaviorManager.prototype = {

    _addBehaviorToObject: function (behaviorName, object) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {

                var behavior = new this._name_beh[behaviorName]();

                if (this._beh_BehObjPairs[behaviorName] == undefined) {
                    this._beh_BehObjPairs[behaviorName] = [];
                }
                this._beh_BehObjPairs[behaviorName].push([behavior, object]);

                console.log("returning behavior", behavior);

                if (typeof (behavior.init) == "undefined") {
                    behavior.prototype.init = function (object) {};
                }
                behavior.init(object); //TODO: Add behavior init functionality for each behavior
                return behavior;
            } else {
                console.log("Behavior "+behaviorName+" has not been registered to JasperCore");
                console.log("returning null");
                return null;

            }
        }

    },

    _createBehavior: function (behaviorName, behaviorClass) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {
                console.log("Behavior name already present : " + behaviorName);
                return null;
            } else {
                //contents.class = "JasperBehavior";
                this._name_beh[behaviorName] = behaviorClass;

                return behaviorName;
            }
        }
    },
    _deleteBehaviorFromObject: function (behaviorName, object) {
        if (this._beh_BehObjPairs[behaviorName] != undefined) {
            var len = this._beh_BehObjPairs[behaviorName].length;
            for (var i = 0; i < len; i++) {
                if (this._beh_BehObjPairs[behaviorName][i][1].__obj_id == object.__obj_id) {
                    this._beh_BehObjPairs[behaviorName].splice(i, 1);
                    return;
                }
            }
        }
    },

    _isNonUpdateBehavior: function (behaviorName) {
        var len = this._nonUpdateBehaviors.length;
        for (var i = 0; i < len; i++) {
            if (this._nonUpdateBehaviors[i] == behaviorName)
                return true;
        }
        return false;
    },
    _addNonUpdateBehavior: function (behaviorName) {
        if (!this._isNonUpdateBehavior(behaviorName))
            this._nonUpdateBehaviors.push(behaviorName);
    }

    //Debug functions:
    ,

    _getAllBehaviors: function () {
        var behNames = [];
        for (name in this._name_beh)
            behNames.push(name);
        return behNames;
    },
    _getBehArray: function () {
        return this._beh_BehObjPairs;
    }


};