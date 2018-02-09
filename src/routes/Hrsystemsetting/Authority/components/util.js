import i18n from './../../../../lib/i18n';
export function generateData(x = 2, y = 3, z = 1, gData = []) {
    // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
    // function _loop(_level, _preKey, _tns) {
    //   const preKey = _preKey || '0';
    //   const tns = _tns || gData;

    //   const children = [];
    //   for (let i = 0; i < x; i++) {
    //     const key = `${preKey}-${i}`;
    //     tns.push({ title: `${key}-label`, key: `${key}-key` });
    //     if (i < y) {
    //       children.push(key);
    //     }
    //   }
    //   if (_level < 0) {
    //     return tns;
    //   }
    //   const __level = _level - 1;
    //   children.forEach((key, index) => {
    //     tns[index].children = [];
    //     return _loop(__level, key, tns[index].children);
    //   });
    // }

    // _loop(z);
    // let tns = {};
    gData = [{
        key: '0',
        title: i18n.t(201140/*弘昊集团*/),
        children: [
            {
                key: '0-1', title: i18n.t(201141/*上海弘昊化工*/),
                children: [{
                    key: '0-1-1', title: i18n.t(201142/*总经理*/),
                    children: [
                        {
                            key: '0-1-1-1', title: i18n.t(201143/*东欧组*/),
                            children: [
                                {
                                    key: '0-1-1-1-1', title: i18n.t(201144/*东欧组经理*/),
                                    children: [
                                        {key: '0-1-1-1-1-1', title: 'sales36'},
                                        {key: '0-1-1-1-1-2', title: 'sales37'},
                                        {key: '0-1-1-1-1-3', title: 'sales38'},
                                        {key: '0-1-1-1-1-4', title: 'sales39'},
                                        {key: '0-1-1-1-1-5', title: 'sales40'}
                                    ]
                                }
                            ]
                        },
                        {key: '0-1-1-2', title: i18n.t(201145/*中东组*/)},
                        {key: '0-1-1-3', title: i18n.t(201146/*非洲组*/)},
                        {key: '0-1-1-4', title: i18n.t(201147/*南亚组*/)}
                    ]
                },
                    {key: '0-1-2', title: i18n.t(201148/*销售部*/)},
                    {key: '0-1-3', title: i18n.t(200251/*采购部*/)},
                    {key: '0-1-4', title: i18n.t(201149/*物流部*/)},
                    {key: '0-1-5', title: i18n.t(201150/*财务部*/)},
                    {key: '0-1-6', title: i18n.t(201151/*人事部*/)}
                ]
            },
            {
                key: '0-2', title: i18n.t(201152/*上海富鼎化工有限公司*/),
                children: [{key: '0-2-1', title: i18n.t(201153/*售前小组*/)},
                    {key: '0-2-2', title: i18n.t(201154/*售后小组*/)},
                    {key: '0-2-3', title: i18n.t(201155/*开发小组*/)},
                    {key: '0-2-4', title: i18n.t(201156/*财务小组*/)}
                ]
            },
            {
                key: '0-3', title: i18n.t(201157/*上海怒吼数据科技有限公司*/),
                children: [{key: '0-3-1', title: i18n.t(201158/*产品部*/)},
                    {key: '0-3-2', title: 'UI部'},
                    {key: '0-3-3', title: i18n.t(201159/*前端部*/)},
                    {key: '0-3-4', title: i18n.t(201160/*后台部*/)},
                    {key: '0-3-5', title: i18n.t(201161/*测试部*/)}
                ]
            },
        ]
    }];
    return gData;
}
export function calcTotal(x = 2, y = 3, z = 1) {
    /* eslint no-param-reassign:0*/
    const rec = (n) => n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
    return rec(z + 1);
}
console.log('总节点数（单个tree）：', calcTotal());
// 性能测试：总节点数超过 2000（z要小）明显感觉慢。z 变大时，递归多，会卡死。

export const gData = generateData();

export function isInclude(smallArray, bigArray) {
    return smallArray.every((ii, i) => {
        return ii === bigArray[i];
    });
}
// console.log(isInclude(['0', '1'], ['0', '10', '1']));

// arr.length === 628, use time: ~20ms
export function filterParentPosition(arr) {
    const levelObj = {};
    arr.forEach((item) => {
        const posLen = item.split('-').length;
        if (!levelObj[posLen]) {
            levelObj[posLen] = [];
        }
        levelObj[posLen].push(item);
    });
    const levelArr = Object.keys(levelObj).sort();
    for (let i = 0; i < levelArr.length; i++) {
        if (levelArr[i + 1]) {
            levelObj[levelArr[i]].forEach(ii => {
                for (let j = i + 1; j < levelArr.length; j++) {
                    levelObj[levelArr[j]].forEach((_i, index) => {
                        if (isInclude(ii.split('-'), _i.split('-'))) {
                            levelObj[levelArr[j]][index] = null;
                        }
                    });
                    levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(p => p);
                }
            });
        }
    }
    let nArr = [];
    levelArr.forEach(i => {
        nArr = nArr.concat(levelObj[i]);
    });
    return nArr;
}
// console.log(filterParentPosition(
//   ['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']
// ));

function loopData(data, callback) {
    const loop = (d, level = 0) => {
        d.forEach((item, index) => {
            const pos = `${level}-${index}`;
            if (item.children) {
                loop(item.children, pos);
            }
            callback(item, index, pos);
        });
    };
    loop(data);
}

function spl(str) {
    return str.split('-');
}
function splitLen(str) {
    return str.split('-').length;
}

export function getFilterExpandedKeys(data, expandedKeys) {
    const expandedPosArr = [];
    loopData(data, (item, index, pos) => {
        if (expandedKeys.indexOf(item.key) > -1) {
            expandedPosArr.push(pos);
        }
    });
    const filterExpandedKeys = [];
    loopData(data, (item, index, pos) => {
        expandedPosArr.forEach(p => {
            if ((splitLen(pos) < splitLen(p)
                && p.indexOf(pos) === 0 || pos === p)
                && filterExpandedKeys.indexOf(item.key) === -1) {
                filterExpandedKeys.push(item.key);
            }
        });
    });
    return filterExpandedKeys;
}

function isSibling(pos, pos1) {
    pos.pop();
    pos1.pop();
    return pos.join(',') === pos1.join(',');
}

export function getRadioSelectKeys(data, selectedKeys, key) {
    const res = [];
    const pkObjArr = [];
    const selPkObjArr = [];
    loopData(data, (item, index, pos) => {
        if (selectedKeys.indexOf(item.key) > -1) {
            pkObjArr.push([pos, item.key]);
        }
        if (key && key === item.key) {
            selPkObjArr.push(pos, item.key);
        }
    });
    const lenObj = {};
    const getPosKey = (pos, k) => {
        const posLen = splitLen(pos);
        if (!lenObj[posLen]) {
            lenObj[posLen] = [[pos, k]];
        } else {
            lenObj[posLen].forEach((pkArr, i) => {
                if (isSibling(spl(pkArr[0]), spl(pos))) {
                    // 后来覆盖前者
                    lenObj[posLen][i] = [pos, k];
                } else if (spl(pkArr[0]) !== spl(pos)) {
                    lenObj[posLen].push([pos, k]);
                }
            });
        }
    };
    pkObjArr.forEach((pk) => {
        getPosKey(pk[0], pk[1]);
    });
    if (key) {
        getPosKey(selPkObjArr[0], selPkObjArr[1]);
    }

    Object.keys(lenObj).forEach((item) => {
        lenObj[item].forEach((i) => {
            if (res.indexOf(i[1]) === -1) {
                res.push(i[1]);
            }
        });
    });
    return res;
}
