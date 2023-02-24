<template>
  <div class="app-container home">
    <div class="gva-card">
      <el-card shadow="always" style="width:83vw;height: 40vh;z-index: 99">
        <div class="gva-top-card-left-title">您好，管理员，请开始今天的工作吧!</div>
        <div style="padding-top: 15px;color: #6b7687;font-size: 15px">{{ this.weatherInfo }}</div>
        <div style="font-size: 20px;color: #1e1e1e;line-height: 20px;padding-top: 20px" >快捷入口:</div>
        <el-row :gutter="20" style="padding-top: 50px;width: 80%">
          <el-col
            v-for="(card, key) in toolCards"
            :key="key"
            :span="4"
            :xs="8"
            class="quick-entrance-items"
          >
            <div class="quick-entrance-item" @click="toTarget(card.path)">
              <div class="quick-entrance-item-icon" :style="{ backgroundColor: card.bg }">
                <i :class="card.icon"  :style="{ color: card.color}"  style="padding: 15px 10px"> </i>
              </div>
              <p>{{ card.label }}</p>
            </div>
          </el-col>
        </el-row>
        <img src="../../public/img.png" alt="" style="width:30vw;height:60vh;position: absolute;right:3vw;top: -3vh">
      </el-card >
      <div style="color: #6b7687;font-size: 15px;position: absolute;bottom: 0%;left: 50%;transform: translate(-50%, -50%); ">
          技术支持:防灾科技学院信息工程学院519网络云实验室
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import {constantRoutes} from "@/router";

export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.3",
      weatherInfo:'',
      toolCards:[
        {
          label: '导航栏管理',
          icon: 'el-icon-menu',
          path: '/navigationManage/index',
          color: '#ff9c6e',
          bg: 'rgba(255, 156, 110,.3)'
        },
        {
          label: '文件管理',
          icon: 'el-icon-folder',
          path: '/fileManage',
          color: '#69c0ff',
          bg: 'rgba(105, 192, 255,.3)'
        },
        {
          label: '其他管理',
          icon: 'el-icon-monitor',
          path: '/otherManage/OtherManage',
          color: '#b37feb',
          bg: 'rgba(179, 127, 235,.3)'
        },
        {
          label: '数据备份',
          icon: 'el-icon-cpu',
          path: '/dataBackup/dataBackup',
          color: '#ffd666',
          bg: 'rgba(255, 214, 102,.3)'
        },
      ]
    };
  },
  mounted() {
    this.ip()
  },
  methods: {
    toTarget(href) {
      this.$router.push({ path: href || "/" }).catch(()=>{});
    },
    async ip(){
      await axios.get('https://restapi.amap.com/v3/ip?key=' + '8e8baa8a7317586c29ec694895de6e0a').then((res) => {
        if (res.data.adcode) {
          this.getWeather(res.data.adcode)
        }
      })
    },

    async getWeather(code){
      const response = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=' + '8e8baa8a7317586c29ec694895de6e0a' + '&extensions=base&city=' + code)
      if (response.data.status === '1') {
        const s = response.data.lives[0]
        console.log(s)
        this.weatherInfo = s.city + ' 天气：' + s.weather + ' 温度：' + s.temperature + '摄氏度 风向：' + s.winddirection + ' 风力：' + s.windpower + '级 空气湿度：' + s.humidity
      }
    }
  },
};
</script>

<style scoped lang="scss">

.gva-top-card-left-dot {

  padding-top: 15px;
}
.gva-card {
  padding: 20px 10px !important;
  .gva-top-card {
    height: auto;
    &-left {
      &-title {
        font-size: 20px !important;
      }
      &-rows {
        margin-top: 15px;
        align-items: center;
      }
    }
    &-right {
      display: none;
    }
  }
  .gva-middle-card {
    &-item {
      line-height: 20px;
    }
  }
  .dashboard-icon {
    font-size: 18px;
  }
}

.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

.quick-entrance-items {
  justify-content: center;
  text-align: center;
  color: #333;
  .quick-entrance-item {
    padding: 4px 7px;
    margin-top: -16px;
    margin-bottom: -16px;
    border-radius: 4px;
    transition: all 0.2s;
    &:hover{
      box-shadow: 0px 0px 7px 0px rgba(217, 217, 217, 0.55);
    }
    cursor: pointer;
    height: auto;
    text-align: center;
    &-icon {
      width: 50px;
      height: 50px !important;
      border-radius: 8px;
      justify-content: center;
      margin: 0 auto;
      i {
        font-size: 24px;
      }
    }
    p {
      margin-top: 10px;
    }
  }
}
</style>

