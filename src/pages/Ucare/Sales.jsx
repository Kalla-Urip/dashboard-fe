import { Icon } from "@iconify/react";
import { Affix, Button, Modal, Spin, Typography } from "antd";
import { aiService } from "../../services/ai.service";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import pallete from "../../utils/pallete";
import RenderIf from "../../components/RenderIf";

export default function UCareSales(){

  const [insight, setInsight] = useState('')
  const [modal, setModal] = useState(false)

  const fullRef = useRef()
  const timerRef = useRef()

  const startTyping = (text, speed) => {
    if(timerRef.current) clearInterval(timerRef.current)
    setInsight('')
    fullRef.current = text

    let i = 0

    timerRef.current = setInterval(() => {
      setInsight(prev => prev + text[i])
      i++
      if(i >= text.length && timerRef.current){
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, speed)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const insightMutation = useMutation({
    mutationFn: () => aiService.salesInsight(),
    onSuccess: ({ data }) => {
      console.log(data)
      startTyping(data, 13)
      // setInsight(data)
    }
  })

  const handleOpenModal = () => {
    setModal(true)
    insightMutation.mutate()
  }

  const handleCloseModal = () => {
    setModal(false)
    setInsight('')
  }

  return(
    <>
      <Affix style={{ position: 'absolute', right: 25, top: 75 }} >
        <Button 
          onClick={handleOpenModal}
          variant="solid" 
          color="primary"
          icon={
            <Icon
              icon="hugeicons:ai-innovation-02"
              // style={{ marginBottom: 0, marginLeft: -2 }}
              width="20"
              height="20"
            /> 
          }
        >
          Generate Insight
        </Button>
      </Affix>
      <iframe  src="https://lookerstudio.google.com/embed/reporting/2f3b0faa-4782-415d-b8a4-151c63438a2c/page/jYRfD" frameBorder="0" style={{ border: 0, width: '100%', height: '77vh' }} allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
      <Modal
        open={modal}
        centered
        width={'90vw'}
        title="Insight Extractor"
        onCancel={handleCloseModal}
        onOk={insightMutation.mutate}
        okText={"Generate"}
        okButtonProps={{
          loading: insightMutation.isPending,
        }}
        styles={{
          body: {
            height: '80vh'
          }
        }}
      >
        <div style={{ height: '100%', backgroundColor: pallete.grey[200], borderRadius: 10, padding: '4px 20px', boxSizing: 'border-box' }} >
          <RenderIf when={insightMutation.isPending} >
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
              <div style={{ display: 'flex', flexDirection: 'column' }} >
                <Spin size="large" />
                <Typography.Text style={{ color: pallete.primary.main, fontSize: 14, marginTop: 10 }} >
                  Menganalisis data ...
                </Typography.Text>
              </div>
            </div>
          </RenderIf>
          <RenderIf when={!insightMutation.isPending} >
            <div className="markdown"  >
              <Markdown remarkPlugins={[remarkGfm]} >
                {insight}
              </Markdown>
            </div>
          </RenderIf>
        </div>
      </Modal>
    </>
  )
}