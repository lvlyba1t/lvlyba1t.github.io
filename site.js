const {contacts, projects} = window.NSK;
document.querySelectorAll('[data-contacts]').forEach(container => {
  for (const [key,label] of [['email','e-mail'],['telegram','telegram'],['instagram','instagram']]) {
    const target = contacts[key];
    const item = document.createElement(target ? 'a' : 'span');
    item.className = 'contact-link'; item.textContent = label;
    if (target) {
      item.href = key === 'email' && !target.startsWith('mailto:') ? `mailto:${target}` : target;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      item.setAttribute('aria-label', key === 'email' ? 'Write an email' : `Open ${label} in a new tab`);
      item.title = key === 'email' ? 'Write an email' : `Open ${label}`;
    }
    container.append(item);
  }
});
const grid = document.getElementById('project-grid');
let current = 0;
function renderProjects() {
  grid.replaceChildren();
  for (let i=0; i<Math.min(3,projects.length); i++) {
    const project=projects[(current+i)%projects.length];
    const card=document.createElement('a');card.className='project-card';card.dataset.project=project.id;card.href=`project.html?project=${project.id}`;
    const cover=document.createElement('div');cover.className='project-cover';
    const image=document.createElement('img');image.src=`assets/${project.cover}`;image.alt=project.title;image.loading='lazy';image.width=768;image.height=600;
    if (project.coverPosition) image.style.objectPosition = project.coverPosition;
    const category=document.createElement('span');category.className='category';category.textContent=project.category;
    const title=document.createElement('h3');title.textContent=project.title;
    const description=document.createElement('p');description.textContent=project.description;
    cover.append(image,category);card.append(cover,title,description);grid.append(card);
  }
  document.getElementById('gallery-status').textContent=`Showing ${projects[current].title}`;
}
if(grid){
  renderProjects();
  document.querySelector('.previous').addEventListener('click',()=>{current=(current+projects.length-1)%projects.length;renderProjects()});
  document.querySelector('.next').addEventListener('click',()=>{current=(current+1)%projects.length;renderProjects()});
  let startX=0;grid.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});grid.addEventListener('touchend',e=>{const diff=e.changedTouches[0].clientX-startX;if(Math.abs(diff)>50){current=(current+(diff<0?1:projects.length-1))%projects.length;renderProjects()}},{passive:true});
}
const caseRoot=document.getElementById('case-root');
if(caseRoot){
  const id=new URLSearchParams(location.search).get('project');
  const project=projects.find(p=>p.id===id);
  if(project){
    document.title=`${project.title} â€” The NSK`;
    document.getElementById('case-title').textContent=project.title;
    document.getElementById('case-category').textContent=project.category;
    for(const file of project.images){const img=document.createElement('img');img.src=`assets/${file}`;img.alt=`${project.title} â€” ${project.description}`;img.loading='lazy';caseRoot.append(img)}
    const next=projects[(projects.indexOf(project)+projects.length-1)%projects.length];const link=document.getElementById('next-case');link.href=`project.html?project=${next.id}`;link.textContent=`Next: ${next.title}`;
  }else{document.getElementById('case-title').textContent='Project not found';document.getElementById('next-case').hidden=true;}
}
