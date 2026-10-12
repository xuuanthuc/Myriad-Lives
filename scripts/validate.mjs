import {validateContent,events} from '../src/engine/content.js';
import {validateTranslations} from '../src/i18n/index.js';
validateContent();
validateTranslations();
console.log(`${events.length} sự kiện hợp lệ; bản dịch Việt / Trung / Anh đầy đủ.`);
