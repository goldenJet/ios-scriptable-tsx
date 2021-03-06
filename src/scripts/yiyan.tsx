/**
 * 一言
 * 改写于：https://github.com/im3x/Scriptables/blob/main/%E4%B8%80%E8%A8%80/latest.js
 */
import {isLaunchInsideApp, request, ResponseType, showActionSheet, showPreviewOptions} from '@app/lib/help'

interface RemoteData {
  id: number
  uuid: string
  hitokoto: string
  type: string
  from: string
  from_who: string
  creator: string
  creator_uid: number
  reviewer: number
  commit_from: string
  created_at: number
  length: number
}

class YiyanWidget {
  private widget!: ListWidget
  async init() {
    if (isLaunchInsideApp()) {
      return await showPreviewOptions(this.render.bind(this))
    }
    this.widget = (await this.render()) as ListWidget
    Script.setWidget(this.widget)
    Script.complete()
  }
  async render(): Promise<unknown> {
    const data = (await this.getRemoteData()).data || ({} as RemoteData)
    const {hitokoto = '', from = ''} = data
    return (
      <wbox>
        <wstack verticalAlign="center">
          <wimage
            src="https://txc.gtimg.com/data/285778/2020/1012/f9cf50f08ebb8bd391a7118c8348f5d8.png"
            width={14}
            height={14}
            borderRadius={4}
          ></wimage>
          <wspacer length={10}></wspacer>
          <wtext opacity={0.7} font={Font.boldSystemFont(12)}>
            一言
          </wtext>
        </wstack>
        <wspacer></wspacer>
        <wtext font={Font.lightSystemFont(16)} onClick={() => this.menu()}>
          {hitokoto}
        </wtext>
        <wspacer></wspacer>
        <wtext font={Font.lightSystemFont(12)} opacity={0.5} textAlign="right" maxLine={1}>
          {from}
        </wtext>
      </wbox>
    )
  }
  async getRemoteData(): Promise<ResponseType<RemoteData>> {
    return await request<RemoteData>({
      url: 'https://v1.hitokoto.cn',
      dataType: 'json',
    })
  }
  async menu(): Promise<void> {
    const selectIndex = await showActionSheet({
      title: '菜单',
      itemList: [
        {
          text: '预览组件',
        },
      ],
    })
    switch (selectIndex) {
      case 0:
        await showPreviewOptions(this.render.bind(this))
        break
    }
  }
}

EndAwait(() => new YiyanWidget().init())
