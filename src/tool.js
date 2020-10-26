import groupBy from "lodash/groupBy";

export const mockData = [
  {
    name: "测试合辑-我原名-1",
    colorText: "红色",
    color: "red"
  },
  {
    name: "测试合辑-我原名-2",
    colorText: "绿色",
    color: "lightgreen"
  },
  {
    name: "测试合辑-我原名-3",
    colorText: "蓝色",
    color: "lightblue"
  },
  {
    name: "测试合辑-我原名-4",
    colorText: "黄色",
    color: "yellow"
  },
  {
    name: "测试合辑-我原名-5",
    colorText: "橙色",
    color: "orange"
  }
];

function sliceAlbums(result, key, value, count, maxLength) {
  for (let index = 0; index < count; index++) {
    const newKey = `${key}-合辑${index + 1}`;
    const start = index * maxLength;
    const end = (index + 1) * maxLength;
    const newValue = value.slice(start, end);
    result[newKey] = newValue;
  }
}

function sliceAlbumByLength(albumData, maxLength) {
  const keys = Object.keys(albumData);
  const result = {};

  keys.forEach((key) => {
    const value = albumData[key].sort((a, b) => {
      const a_name = a.show_name || a.name;
      const b_name = b.show_name || b.name;
      return a_name.localeCompare(b_name, "zh");
    });
    const len = value.length;
    if (len <= maxLength) {
      result[key] = value;
    } else {
      // 相同合辑名字的的个数超过限制了
      // 例如一个合辑只需要3个元素，但是一次上传的数据 t1-a-1 ~ t1-a-8一共8个，那就要分成3个合辑
      const count = Math.ceil(len / maxLength);
      sliceAlbums(result, key, value, count, maxLength);
    }
  });
  return result;
}

function sliceMaterialName(names) {
  // 这里不判断了，调用之前就判断了，
  const len = names.length;
  // 不要最后一个
  const r = names.slice(0, len - 1);
  return r.join("-");
}

function partatialList(list, maxLength) {
  const namesData = list.map((item, i) => {
    // 把理想的合辑名称拿出来
    let { show_name, name } = item;
    let album_name = show_name || name;
    const names = album_name.split("-");
    if (names.length > 2) {
      album_name = sliceMaterialName(names);
    }
    return { album_name, index: i, name, show_name };
  });
  // 按照理想的合辑名称归类
  let albumData = groupBy(namesData, (item) => item.album_name);
  albumData = sliceAlbumByLength(albumData, maxLength);

  // albums 出来就是合辑了
  const albums = Object.keys(albumData).map((key) => {
    const children = albumData[key].map((indexItem, i) => {
      const child = list[indexItem.index];
      if (!child.show_name) {
        child.show_name = `${key}-${i + 1}`;
      }
      return child;
    });
    const o = {
      show_name: key,
      children,
      maxLength
    };
    return o;
  });
  return albums;
}

export const divideList = (list, maxLength) => {
  if (list.length === 0) {
    return [];
  }
  // 合辑分组逻辑
  const arr = partatialList(list, maxLength);
  return arr;
};
