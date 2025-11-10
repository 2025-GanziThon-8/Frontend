// src/App.jsx
import BtnLong from './component/BtnLong.jsx';
import BtnRoute from './component/BtnRoute.jsx';
import AddRoute from './component/AddRoute.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-bold-40 text-primary-green">SafePath</h1>
      <p className="text-regular-16 text-neutral-gray300 mt-4">
        프론트엔드 초기 세팅 완료 🎉
      </p>

      {/* BtnLong 컴포넌트 */}
      <BtnLong className="mt-8">
        확인
      </BtnLong>

      {/* BtnRoute 컴포넌트 */}
      <BtnRoute
        className="mt-4"/>

      {/* AddRoute 컴포넌트 */}
      <AddRoute 
        className="mt-4"/>
    </div>
  );
}

