import React from 'react'
import './background.scss'

export type BackgroundProps = {
  style?: 'solid' | 'gradient' | 'transparent'
}

export function Background({ style = 'gradient' }: BackgroundProps) {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <svg className={'background'} xmlns={'http://www.w3.org/2000/svg'} version={'1.1'} width={'100%'} height={'100%'} preserveAspectRatio={'xMidYMid slice'} viewBox={'0 0 2560 1440'}>
      <defs>
        <mask id={'SvgjsMask1006'}>
          <rect width={'2560'} height={'1440'} fill={'#ffffff'}/>
        </mask>
        {style === 'gradient' ?
          (
            <linearGradient x1={'10.94%'} y1={'-19.44%'} x2={'89.06%'} y2={'119.44%'} gradientUnits={'userSpaceOnUse'} id={'SvgjsLinearGradient1007'}>
              <stop stopColor={'rgba(231, 29, 54, 1)'} offset={'0'}/>
              <stop stopColor={'rgba(231, 106, 29, 1)'} offset={'1'}/>
            </linearGradient>
          ) :
          null}
      </defs>
      <g mask={'url(#SvgjsMask1006)'} fill={'none'}>
        {style !== 'transparent' ? <rect width={'2560'} height={'1440'} x={'0'} y={'0'} fill={style === 'solid' ? 'rgba(231, 29, 54, 1)' : 'url(#SvgjsLinearGradient1007)'}/> : null}
        <g transform={'translate(0, 0)'} strokeLinecap={'round'}>
          <path d={'M280 587.78 L280 707.78'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M280 752.78 L280 852.22'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M320 493.19 L320 613.19'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M320 658.19 L320 808.19'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M320 853.19 L320 946.82'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M360 196.86 L360 946.86'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M360 991.86 L360 1243.14'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M400 180.81 L400 1080.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M400 1125.81 L400 1259.19'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M440 670.13 L440 769.87'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M480 561.89 L480 711.89'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M480 756.89 L480 878.11'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M520 560.22 L520 879.78'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M560 439.98 L560 739.98'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M560 784.98 L560 844.98'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M560 889.98 L560 1000.02'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M600 198.72 L600 978.72'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M600 1023.72 L600 1241.28'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M640 169.21 L640 409.21'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M640 454.21 L640 1270.8'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M680 287.97 L680 857.97'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M680 902.97 L680 1152.03'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M720 398.08 L720 548.08'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M720 593.08 L720 1041.91'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M760 257.51 L760 1182.49'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M800 265.9 L800 775.9'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M800 820.9 L800 1000.9'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M800 1045.9 L800 1174.1'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M840 443.23 L840 773.23'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M840 818.23 L840 878.23'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M840 923.23 L840 996.77'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M880 569.19 L880 689.19'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M880 734.19 L880 870.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M920 568.58 L920 871.42'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M960 236.85 L960 1046.85'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M960 1091.85 L960 1121.85'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M960 1166.85 L960 1203.15'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1000 561.1 L1000 741.1'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1000 786.1 L1000 878.9'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1040 488.93 L1040 758.93'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1040 803.93 L1040 951.08'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1080 161.55 L1080 281.55'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1080 326.55 L1080 716.55'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1080 761.55 L1080 1278.45'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1120 249.51 L1120 639.51'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1120 684.51 L1120 924.51'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1120 969.51 L1120 1190.49'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1160 630.27 L1160 660.27'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1160 705.27 L1160 809.73'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1200 426.13 L1200 666.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1200 711.13 L1200 771.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1200 816.13 L1200 1013.88'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1240 447.87 L1240 717.87'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1240 762.87 L1240 912.87'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1240 957.87 L1240 992.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1280 665.33 L1280 774.67'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1320 473.35 L1320 833.35'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1320 878.35 L1320 966.65'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1360 477.1 L1360 717.1'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1360 762.1 L1360 822.1'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1360 867.1 L1360 962.9'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1400 232.2 L1400 472.2'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1400 517.2 L1400 847.2'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1400 892.2 L1400 1207.8'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1440 454.42 L1440 985.58'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1480 395.81 L1480 605.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1480 650.81 L1480 890.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1480 935.81 L1480 1044.18'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1520 171.55 L1520 681.55'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1520 726.55 L1520 906.55'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1520 951.55 L1520 1268.45'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1560 669.02 L1560 770.98'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1600 581.94 L1600 641.94'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1600 686.94 L1600 746.94'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1600 791.94 L1600 858.06'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1640 400.81 L1640 610.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1640 655.81 L1640 1039.18'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1680 592.88 L1680 622.88'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1680 667.88 L1680 847.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1720 164.19 L1720 1064.19'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1720 1109.19 L1720 1275.81'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1760 623.07 L1760 683.07'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1760 728.07 L1760 816.93'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1800 509.96 L1800 930.04'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1840 449.04 L1840 869.04'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1840 914.04 L1840 990.96'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1880 179.16 L1880 1049.16'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1880 1094.16 L1880 1184.16'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1880 1229.16 L1880 1260.84'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1920 188.54 L1920 1251.45'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M1960 469.46 L1960 709.46'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M1960 754.46 L1960 970.54'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2000 453.53 L2000 543.53'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2000 588.53 L2000 678.53'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2000 723.53 L2000 986.47'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2040 178.25 L2040 1261.76'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2080 591.92 L2080 651.92'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2080 696.92 L2080 848.08'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2120 660.86 L2120 779.14'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2160 419.13 L2160 599.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2160 644.13 L2160 1020.87'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2200 673.87 L2200 766.13'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2240 241.71 L2240 841.71'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2240 886.71 L2240 1198.29'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2280 539.05 L2280 629.05'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.1)'}/>
          <path d={'M2280 674.05 L2280 764.05'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
          <path d={'M2280 809.05 L2280 900.95'} strokeWidth={'30'} stroke={'rgba(0, 0, 0, 0.05)'}/>
        </g>
      </g>
    </svg>
  )
}
