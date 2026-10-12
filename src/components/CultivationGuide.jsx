import { realms, roots, origins } from '../data/realms.js';

const rootDescriptions = [
  'Không thể dẫn khí nhập thể; sống một đời phàm nhân.',
  'Khả năng tu luyện thấp, tiến bộ chậm.',
  'Khả năng tu luyện còn hạn chế.',
  'Khả năng tu luyện ở mức trung bình.',
  'Dẫn khí tốt, tu luyện thuận lợi hơn.',
  'Linh căn ưu tú, tốc độ tích lũy tu vi cao.',
  'Linh căn đặc biệt, có tiềm năng tu luyện cao nhất.',
];

export default function CultivationGuide({ t, run }) {
  return <details className="cultivation-guide">
    <summary><span aria-hidden="true">☷</span> {t('Linh căn & Cảnh giới')} <span className="guide-chevron" aria-hidden="true">⌄</span></summary>
    <section className="codex-panel" aria-labelledby="codex-heading">
      <div className="codex-heading">
        <p className="eyebrow">{t('CẨM NANG TIÊN LỘ')}</p>
        <h2 id="codex-heading">{t('Linh căn & Cảnh giới')}</h2>
        <p>{t('Tra cứu các loại đang có trong game. Dòng được đánh dấu là số mệnh hiện tại của ngươi.')}</p>
      </div>
      <div className="codex-grid">
        <section>
          <h3>{t('Linh căn')}</h3>
          <p className="codex-description">{t('Linh căn được sinh ngẫu nhiên và ảnh hưởng khả năng tu luyện. Linh căn tốt vẫn có thể gặp kết cục xấu.')}</p>
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
          <h3>{t('Cảnh giới')}</h3>
          <p className="codex-description">{t('Tu luyện theo thứ tự từ thấp đến cao. Mỗi lần đột phá thành công sẽ mở cảnh giới tiếp theo.')}</p>
          <table>
            <caption className="sr-only">{t('Thứ tự cảnh giới và thọ nguyên cơ sở')}</caption>
            <thead><tr><th scope="col">{t('Bậc')}</th><th scope="col">{t('Cảnh giới')}</th><th scope="col">{t('Thọ nguyên cơ sở')}</th></tr></thead>
            <tbody>{realms.map((realm,index) => {
              const current = run?.state.realm === index;
              return <tr key={realm.id} className={current ? 'codex-current' : ''}>
                <td className="codex-rank">{String(index+1).padStart(2,'0')}</td>
                <th scope="row">{t(realm.name)}{current && <small className="codex-badge">{t('Kiếp này')}</small>}</th>
                <td className="codex-lifespan">{index===0?'70–95':realm.lifespan.toLocaleString('en-US')} {t('tuổi')}</td>
              </tr>;
            })}
              <tr className="codex-ascension"><td className="codex-rank">✦</td><th scope="row">{t('Phi thăng')}</th><td>{t('Kết cục thành công')}</td></tr>
            </tbody>
          </table>
          <p className="codex-note">{t('Thọ nguyên là giới hạn tuổi cơ sở, không phải tuổi sống chắc chắn. Biến cố có thể làm thay đổi thọ nguyên hoặc khiến ngươi chết sớm. Vượt qua Độ Kiếp sẽ kết thúc bằng Phi thăng.')}</p>
        </section>
      </div>
      <section className="codex-origins">
        <h3>{t('Xuất thân')}</h3>
        <p className="codex-description">{t('Xuất thân quyết định nơi lớn lên và tài nguyên ban đầu, không bảo đảm linh căn. Trẻ sinh trong tông môn vẫn có thể không tu luyện được.')}</p>
        <table>
          <thead><tr><th scope="col">{t('Xuất thân')}</th><th scope="col">{t('Nơi bắt đầu')}</th><th scope="col">{t('Tài nguyên ban đầu')}</th></tr></thead>
          <tbody>{origins.map(origin => <tr key={origin.id} className={run?.profile.origin.id===origin.id?'codex-current':''}>
            <th scope="row">{t(origin.name)}{run?.profile.origin.id===origin.id && <small className="codex-badge">{t('Kiếp này')}</small>}</th>
            <td>{t(origin.bornInSect?'Trong tông môn':'Ngoài tông môn')}</td>
            <td>{origin.startingResources}</td>
          </tr>)}</tbody>
        </table>
      </section>
    </section>
  </details>;
}
