import React, { useEffect } from 'react';

// const AdSencePanel = ({ slotId }) => {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (error) {
//       console.error('adSence error', error);
//     }
//   }, []);

//   return (
//     <div className='ad' style={{ textAlign: 'center' }}>
//       <ins
//         style={{ display: 'block' }}
//         data-ad-client='ca-pub-8300648839719622'
//         data-ad-slot={slotId}
//         data-ad-format='auto'
//         data-full-width-responsive='true'
//       />
//     </div>
//   );
// };

const AdSencePanel = ({ slotId }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('adSence error', error);
    }
  }, []);

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'inline-block', width: `345px`, height: `400px` }}
      data-ad-client='ca-pub-8300648839719622'
      data-ad-slot={slotId}
    />
  );
};

export default AdSencePanel;
