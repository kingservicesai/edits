import os,subprocess,sys
d=sys.argv[1]; out=sys.argv[2]; cols=int(sys.argv[3]) if len(sys.argv)>3 else 10
fs=sorted(os.listdir(d),key=lambda s:float(s[1:-4]))
args=[];[args.extend(['-i',os.path.join(d,f)]) for f in fs]
n=len(fs);lay='|'.join(f'{(i%cols)*216}_{(i//cols)*384}' for i in range(n))
fc=''.join(f'[{i}:v]scale=216:-1[s{i}];' for i in range(n))+''.join(f'[s{i}]' for i in range(n))+f'xstack=inputs={n}:layout={lay}'
subprocess.run(['ffmpeg','-v','error','-y',*args,'-filter_complex',fc,out],check=True)
