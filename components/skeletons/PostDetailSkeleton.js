import React from 'react';
import { View, Dimensions } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { SKELETON_COLORS } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const PostDetailSkeleton = () => {
  // Configuration commune pour tous les Skeleton
  const skeletonConfig = {
    colors: [SKELETON_COLORS.base, SKELETON_COLORS.highlight],
    transition: {
      type: 'timing',
      duration: 1000, // Plus rapide
      loop: true,
    },
    // Effet de "wave" pour un mouvement plus visible
    // (décommentez si vous voulez essayer)
    // transition: {
    //   type: 'spring',
    //   damping: 10,
    //   loop: true,
    // },
  };

  return (
    <View style={{ padding: 16, gap: 20, backgroundColor: '#FFFFFF' }}>
      {/* Galerie média */}
      <Skeleton
        {...skeletonConfig}
        width={width - 32}
        height={250}
        radius={8}
      />

      {/* En-tête */}
      <View style={{ gap: 8 }}>
        <Skeleton {...skeletonConfig} width="70%" height={24} radius={4} />
        <Skeleton {...skeletonConfig} width="40%" height={20} radius={4} />
        <Skeleton {...skeletonConfig} width="60%" height={16} radius={4} />
      </View>

      {/* Caractéristiques */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={{ width: '48%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Skeleton
                {...skeletonConfig}
                width={20}
                height={20}
                radius="round"
              />
              <Skeleton {...skeletonConfig} width={100} height={16} radius={4} />
            </View>
          </View>
        ))}
      </View>

      {/* Équipements */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            {...skeletonConfig}
            width={80}
            height={24}
            radius={12}
          />
        ))}
      </View>

      {/* Description */}
      <View style={{ gap: 6 }}>
        <Skeleton {...skeletonConfig} width="30%" height={18} radius={4} />
        <Skeleton {...skeletonConfig} width="100%" height={16} radius={4} />
        <Skeleton {...skeletonConfig} width="90%" height={16} radius={4} />
        <Skeleton {...skeletonConfig} width="80%" height={16} radius={4} />
      </View>

      {/* Propriétaire */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton
          {...skeletonConfig}
          width={60}
          height={60}
          radius="round"
        />
        <View style={{ gap: 6 }}>
          <Skeleton {...skeletonConfig} width={120} height={18} radius={4} />
          <Skeleton {...skeletonConfig} width={80} height={14} radius={4} />
        </View>
      </View>
    </View>
  );
};

export default PostDetailSkeleton;
// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import { Skeleton } from 'moti/skeleton';
// import { SKELETON_COLORS } from '../../constants/Theme';
// const { width } = Dimensions.get('window');



// const PostDetailSkeleton = () => {
//   return (
//     <View style={{ padding: 16, gap: 20, backgroundColor: '#FFFFFF' }}>
//       {/* Galerie média */}
//       <Skeleton 
//         width={width - 32} 
//         height={250} 
//         radius={8}
//         colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         transition={{
//           type: 'timing',
//           duration: 1500,
//           loop: true,
//         }}
//       />

//       {/* En-tête */}
//       <View style={{ gap: 8 }}>
//         <Skeleton 
//           width="70%" 
//           height={24} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <Skeleton 
//           width="40%" 
//           height={20} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <Skeleton 
//           width="60%" 
//           height={16} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//       </View>

//       {/* Caractéristiques */}
//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
//         {[...Array(4)].map((_, i) => (
//           <View key={i} style={{ width: '48%' }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//               <Skeleton 
//                 width={20} 
//                 height={20} 
//                 radius="round"
//                 colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//               />
//               <Skeleton 
//                 width={100} 
//                 height={16} 
//                 radius={4}
//                 colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//               />
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* Équipements */}
//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//         {[...Array(6)].map((_, i) => (
//           <Skeleton 
//             key={i} 
//             width={80} 
//             height={24} 
//             radius={12}
//             colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//           />
//         ))}
//       </View>

//       {/* Description */}
//       <View style={{ gap: 6 }}>
//         <Skeleton 
//           width="30%" 
//           height={18} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <Skeleton 
//           width="100%" 
//           height={16} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <Skeleton 
//           width="90%" 
//           height={16} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <Skeleton 
//           width="80%" 
//           height={16} 
//           radius={4}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//       </View>

//       {/* Propriétaire */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//         <Skeleton 
//           width={60} 
//           height={60} 
//           radius="round"
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />
//         <View style={{ gap: 6 }}>
//           <Skeleton 
//             width={120} 
//             height={18} 
//             radius={4}
//             colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//           />
//           <Skeleton 
//             width={80} 
//             height={14} 
//             radius={4}
//             colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PostDetailSkeleton;

// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import { Skeleton } from 'moti/skeleton';
// import { SKELETON_COLORS } from '../../constants/Theme';

// const { width } = Dimensions.get('window');

// const PostDetailSkeleton = () => {
//   return (
//     <Skeleton.Group
//       show
//       animation="pulse" // Optionnel : peut être "pulse" ou "shiver"
//       duration={1200}
     
//     >
//       <View style={{ padding: 16, gap: 20, backgroundColor: '#FFFFFF' }}>
//         {/* Galerie média */}
//         <Skeleton
//           width={width - 32}
//           height={250}
//           radius={8}
//           colors={[SKELETON_COLORS.base, SKELETON_COLORS.highlight, SKELETON_COLORS.base]}
//         />

//         {/* En-tête */}
//         <View style={{ gap: 8 }}>
//           <Skeleton width="70%" height={24} radius={4} />
//           <Skeleton width="40%" height={20} radius={4} />
//           <Skeleton width="60%" height={16} radius={4} />
//         </View>

//         {/* Caractéristiques */}
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
//           {[...Array(4)].map((_, i) => (
//             <View key={i} style={{ width: '48%' }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                 <Skeleton width={20} height={20} radius="round" />
//                 <Skeleton width={100} height={16} radius={4} />
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Équipements */}
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//           {[...Array(6)].map((_, i) => (
//             <Skeleton key={i} width={80} height={24} radius={12} />
//           ))}
//         </View>

//         {/* Description */}
//         <View style={{ gap: 6 }}>
//           <Skeleton width="30%" height={18} radius={4} />
//           <Skeleton width="100%" height={16} radius={4} />
//           <Skeleton width="90%" height={16} radius={4} />
//           <Skeleton width="80%" height={16} radius={4} />
//         </View>

//         {/* Propriétaire */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//           <Skeleton width={60} height={60} radius="round" />
//           <View style={{ gap: 6 }}>
//             <Skeleton width={120} height={18} radius={4} />
//             <Skeleton width={80} height={14} radius={4} />
//           </View>
//         </View>
//       </View>
//     </Skeleton.Group>
//   );
// };

// export default PostDetailSkeleton;
