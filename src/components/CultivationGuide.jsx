import {stagesForRealm} from '../data/subrealms.js';
import { useEffect, useRef } from 'react';
import ArrowIcon from './ArrowIcon.jsx';
import { realms, roots, physiques } from '../data/realms.js';

const rootDescriptions = [
  'Không thể dẫn khí nhập thể; sống một đời phàm nhân.',
  'Khả năng tu luyện thấp, tiến bộ chậm.',
  'Khả năng tu luyện còn hạn chế.',
  'Khả năng tu luyện ở mức trung bình.',
  'Dẫn khí tốt, tu luyện thuận lợi hơn.',
  'Linh căn ưu tú, tốc độ tích lũy tu vi cao.',
  'Linh căn đặc biệt, có tiềm năng tu luyện cao nhất.',
];

const physiqueInfo = {
  'Thể chất thường': ['Phổ biến','Phàm thân thường gặp giữa nhân gian, không mang dị chất bẩm sinh. Có bước được vào tiên lộ hay không còn phải xét linh căn.'],
  'Thanh Linh Thể': ['Hiếm','Một thân linh thể thanh thuần, tiên tư nổi bật hơn phàm thân. Đây là khởi đầu quý giá, còn đường cầu đạo vẫn phải tự mình đi qua.'],
  'Lôi Linh Thể': ['Rất hiếm','Dị thể mang sắc thái lôi linh, căn cốt bẩm sinh rất cao. Dẫu có tên lôi linh, thân này vẫn không tránh được uy lực của thiên kiếp.'],
  'Tiên Thiên Đạo Thể': ['Cực hiếm','Đạo thể trời sinh, đứng đầu các thể chất hiện có. Tiên tư tuy cao, vẫn cần linh căn để tu hành và vẫn chịu những hiểm họa của một đời cầu đạo.'],
};

export default function CultivationGuide({ t, run, open, onOpenChange:setOpen, showTrigger=true }) {
  const dialog=useRef(null);
  useEffect(()=>{
    if(!open)return;
    const node=dialog.current;
    const previousOverflow=document.body.style.overflow;
    node.showModal();
    document.body.style.overflow='hidden';
    return ()=>{
      node.close();
      document.body.style.overflow=previousOverflow;
    };
  },[open]);
  function closeBackdrop(event){
    if(event.target!==dialog.current)return;
    const rect=dialog.current.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)setOpen(false);
  }
  return <div className="cultivation-guide">
    {showTrigger&&<button type="button" className="codex-trigger" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="cultivation-dialog"><span aria-hidden="true">☷</span> {t('Cẩm nang tu tiên')}<ArrowIcon direction={open?'up':'down'}/></button>}
    <dialog ref={dialog} id="cultivation-dialog" className="codex-dialog" aria-labelledby="codex-heading" onClose={()=>setOpen(false)} onClick={closeBackdrop}>
    <div className="codex-dialog-toolbar"><span>{t('CẨM NANG TIÊN LỘ')}</span><button type="button" autoFocus onClick={()=>setOpen(false)} aria-label={t('Đóng cẩm nang')}>×</button></div>
    <section className="codex-panel" aria-labelledby="codex-heading">
      <div className="codex-heading">
        <p className="eyebrow">{t('CẨM NANG TIÊN LỘ')}</p>
        <h2 id="codex-heading">{t('Cẩm nang tu tiên')}</h2>
        <p>{t('Lật từng trang cẩm nang để hiểu căn cốt và các bậc tiên lộ. Những dòng được đánh dấu chính là linh căn, thể chất và cảnh giới của ngươi trong kiếp này.')}</p>
      </div>
      <div className="codex-grid">
        <section>
          <h3>{t('Linh căn')}</h3>
          <p className="codex-description">{t('Linh căn là chiếc cầu nối phàm thân với linh khí trời đất, ảnh hưởng khả năng tu luyện. Căn cốt tốt mở đường thuận lợi, song tiên lộ còn tùy cơ duyên và kiếp nạn.')}</p>
          <table>
            <caption className="sr-only">{t('Các loại linh căn từ thấp đến cao')}</caption>
            <thead><tr><th scope="col">{t('Linh căn')}</th><th scope="col">{t('Đặc điểm')}</th></tr></thead>
            <tbody>{roots.map((root,index) => {
              const current = run?.profile.root.name === root.name;
              return <tr key={root.name} className={current ? 'codex-current' : ''}>
                <th scope="row">{t(root.name)}{current && <small className="codex-badge">{t('Kiếp này')}</small>}</th>
                <td>{t(rootDescriptions[index])}</td>
              </tr>;
            })}</tbody>
          </table>
        </section>
        <section>
          <h3>{t('Cảnh giới')}</h3><p className="codex-description">{t('Luyện Khí có chín tầng; từ Trúc Cơ trở lên chia Sơ kỳ, Trung kỳ và Hậu kỳ. Tiểu cảnh giới tiến theo tu vi; đủ tích lũy mới có thể thử đột phá đại cảnh giới.')}</p>
          <p className="codex-description">{t('Từ phàm tục đến Độ Kiếp, mỗi cảnh giới là một bậc trên đường cầu đạo. Tích đủ tu vi rồi thử phá bình cảnh; chỉ khi đột phá thành công mới bước lên bậc tiếp theo.')}</p>
          <ol className="codex-realm-list" aria-label={t('Thứ tự cảnh giới và thọ nguyên cơ sở')}>
            {realms.map((realm,index)=>{
              const current=run?.state.realm===index;
              const stages=stagesForRealm(index);
              return <li key={realm.id} className={'codex-realm-item'+(current?' codex-current':'')}>
                <div className="codex-realm-summary">
                  <span className="codex-rank">{String(index+1).padStart(2,'0')}</span>
                  <strong>{t(realm.name)}{current&&<small className="codex-badge">{t('Kiếp này')}</small>}</strong>
                  <span className="codex-realm-lifespan"><small>{t('Thọ nguyên cơ sở')}</small>{index===0?'70–95':realm.lifespan.toLocaleString('en-US')} {t('tuổi')}</span>
                </div>
                {stages.length>0&&<ol className="codex-subrealm-list" aria-label={t('Tiểu cảnh giới')}>
                  {stages.map((name,stage)=>{
                    if(index===1&&stage>=3&&stage<=6)return stage===3?<li key="ellipsis" aria-hidden="true"><ArrowIcon/><span>…</span></li>:null;
                    return <li key={name}>
                      {stage>0&&<ArrowIcon/>}
                      <span className={current&&run.state.subrealm===stage?'codex-subrealm-current':''}>{t(name)}</span>
                    </li>;
                  })}
                </ol>}
              </li>;
            })}
            <li className="codex-realm-item codex-ascension"><div className="codex-realm-summary"><span className="codex-rank">✦</span><strong>{t('Phi thăng')}</strong><span className="codex-realm-lifespan">{t('Kết cục thành công')}</span></div></li>
          </ol>
          <p className="codex-note">{t('Thọ nguyên trong bảng là nền tảng của từng cảnh giới; cơ duyên và biến cố có thể khiến nó đổi thay. Vượt qua cửa ải Độ Kiếp, ngươi mới có thể phi thăng tiên giới.')}</p>
        </section>
      </div>
      <section className="codex-origins">
        <h3>{t('Thể chất')}</h3>
        <p className="codex-description">{t('Thể chất là căn cốt bẩm sinh theo ngươi từ lúc xuất thế. Dị thể hiếm có là một phần tiên tư, nhưng không định đoạt linh căn; ngay cả đạo thể cũng phải đi qua hiểm họa trên đường cầu đạo.')}</p>
        <table>
          <caption className="sr-only">{t('Các thể chất đang có trong game')}</caption>
          <thead><tr><th scope="col">{t('Thể chất')}</th><th scope="col">{t('Độ hiếm')}</th><th scope="col">{t('Đặc điểm')}</th></tr></thead>
          <tbody>{physiques.map(physique => {
            const [rarity,description]=physiqueInfo[physique.name];
            const current=run?.profile.physique.name===physique.name;
            return <tr key={physique.name} className={current?'codex-current':''}>
              <th scope="row">{t(physique.name)}{current&&<small className="codex-badge">{t('Kiếp này')}</small>}</th>
              <td>{t(rarity)}</td><td>{t(description)}</td>
            </tr>;
          })}</tbody>
        </table>
      </section>

    </section>
    </dialog>
  </div>;
}
